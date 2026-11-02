import { createRequire } from 'node:module';
import { readFileSync, realpathSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve, join, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function loadYaml() {
  try {
    const require = createRequire(import.meta.url);
    const eslintDir = dirname(require.resolve('eslint/package.json'));
    return require(require.resolve('js-yaml', { paths: [eslintDir] }));
  } catch (err) {
    throw new Error(
      'Falta js-yaml (dependencia transitiva de eslint 8). ' +
        'Verifica node_modules/eslint y node_modules/js-yaml. ' + err.message
    );
  }
}

const YAML = loadYaml();

const ACTIONS = new Set(['ask', 'allow', 'deny']);
const AGENT_MODES = new Set(['primary', 'subagent']);
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_DESC = 1024;
const MAX_NAME = 64;
const AGENTS = ['build', 'coder', 'reviewer'];
const SKILLS = ['code-review', 'quality', 'workflow', 'prompt-enhancer'];
const SECRET_RULES = {
  '*.env': 'deny', '*.env.*': 'deny', '*.env.example': 'allow',
  '*service-account*.json': 'deny', '*credentials*.json': 'deny',
  '*.pem': 'deny', '*.key': 'deny', '*.p12': 'deny', '*.pfx': 'deny',
};
const DESTRUCTIVE_RULES = ['git reset --hard*', 'git clean -f*', 'git push --force*', 'git push -f*'];

const REVIEWER_BASH_WHITELIST = new Set([
  'git status',
  'git status --short',
  'git diff --no-ext-diff',
  'git diff --no-ext-diff --stat',
  'git diff --no-ext-diff --check',
  'git diff --no-ext-diff --cached',
  'git log --oneline -10',
  'git ls-files',
]);

const GLOBAL_BASH_WHITELIST = new Set([
  ...REVIEWER_BASH_WHITELIST,
  'npm run lint',
  'npm run build',
  'npm run audit',
  'node --check server/server.js',
  'node .opencode/scripts/validate.mjs',
  'node --test .opencode/tests/config.test.mjs',
]);

function isAction(v) {
  return typeof v === 'string' && ACTIONS.has(v);
}

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function checkActionValue(val, path, errors) {
  if (isAction(val)) return;
  if (isObject(val)) {
    for (const [k, v] of Object.entries(val)) {
      if (!isAction(v)) errors.push(`${path}.${k} debe ser ask/allow/deny`);
    }
    return;
  }
  errors.push(`${path} debe ser ask/allow/deny o un mapa de ellos`);
}

function checkPermissions(value, path, errors) {
  if (!isObject(value)) {
    errors.push(`${path} debe ser un objeto en la política local`);
    return;
  }
  for (const [tool, rule] of Object.entries(value)) {
    checkActionValue(rule, `${path}.${tool}`, errors);
  }
}

export function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('No se encontró frontmatter delimitado por ---');
  const data = YAML.load(m[1], { schema: YAML.JSON_SCHEMA });
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Frontmatter debe ser un objeto');
  }
  return { data, body: m[2] };
}

export function matchPattern(pattern, str) {
  const re = new RegExp(
    `^${pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.')}$`
  );
  return re.test(str);
}

export function resolvePermission(target, ...maps) {
  let result;
  for (const map of maps) {
    if (typeof map === 'string') { result = map; continue; }
    if (!map) continue;
    for (const [pattern, value] of Object.entries(map)) {
      if (matchPattern(pattern, target)) result = value;
    }
  }
  return result;
}

export function assertWithin(real, root) {
  const r = root.endsWith(sep) ? root : root + sep;
  if (real !== root && !real.startsWith(r)) throw new Error(`Path fuera del workspace: ${real}`);
}

function safe(root, rel, workspaceReal) {
  const real = realpathSync(resolve(root, rel));
  assertWithin(real, workspaceReal);
  // No seguir aliases dentro del workspace hacia archivos que no son configuración.
  if (real !== resolve(workspaceReal, rel)) throw new Error(`Enlace simbólico no admitido: ${rel}`);
  return real;
}

export function loadProject(root) {
  const workspaceReal = realpathSync(root);
  const source = readFileSync(safe(root, '.opencode/opencode.json', workspaceReal), 'utf8');
  const config = JSON.parse(source);
  YAML.load(source, { schema: YAML.JSON_SCHEMA }); // JSON es un subconjunto; detecta claves duplicadas.
  const agents = {};
  const agentDir = safe(root, '.opencode/agent', workspaceReal);
  // Comprobar nombres antes de abrir: no leer un secreto con extensión .md por accidente.
  const agentFiles = readdirSync(agentDir);
  if (agentFiles.some((name) => !AGENTS.some((agent) => name === `${agent}.md`))) {
    throw new Error('Entrada inesperada en agent/; solo se admiten los tres agentes locales');
  }
  for (const name of agentFiles) {
    const file = safe(root, join('.opencode/agent', name), workspaceReal);
    const text = readFileSync(file, 'utf8');
    agents[name.slice(0, -3)] = { ...parseFrontmatter(text), raw: text };
  }
  const skills = {};
  const skillDir = safe(root, '.opencode/skills', workspaceReal);
  const skillNames = readdirSync(skillDir);
  if (skillNames.some((name) => !SKILLS.includes(name))) throw new Error('Entrada inesperada en skills/');
  for (const name of skillNames) {
    const sub = safe(root, join('.opencode/skills', name), workspaceReal);
    if (!statSync(sub).isDirectory()) continue;
    const file = safe(root, join('.opencode/skills', name, 'SKILL.md'), workspaceReal);
    const text = readFileSync(file, 'utf8');
    skills[name] = { ...parseFrontmatter(text), raw: text };
  }
  return { config, agents, skills, workspaceReal };
}

export function validateRules(config, agents, skills, opts) {
  const errors = [];
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    return { ok: false, errors: ['opencode.json no es un objeto'] };
  }

  if (config.default_agent !== 'build') errors.push('default_agent debe ser "build"');
  if (config.formatter !== false) errors.push('formatter debe ser false');
  if ('agent' in config || 'agents' in config) errors.push('No definir agent en opencode.json (usa .opencode/agent/*.md)');
  if (config.$schema !== 'https://opencode.ai/config.json') errors.push('$schema oficial requerido');
  if ('skills' in config) errors.push('Usar descubrimiento estándar de skills, sin rutas duplicadas');

  if (!Array.isArray(config.instructions) || config.instructions.length !== 1) errors.push('instructions debe contener solo .opencode/AGENTS.md');
  else {
    for (const p of config.instructions) {
      if (p !== '.opencode/AGENTS.md') {
        errors.push(`instruction debe ser ".opencode/AGENTS.md": ${p}`);
        continue;
      }
      try {
        const real = safe(opts.root, p, opts.workspaceReal);
        if (!statSync(real).isFile()) errors.push(`instruction no es archivo regular: ${p}`);
      } catch (e) {
        errors.push(`instruction no accesible: ${p} (${e.message})`);
      }
    }
  }

  checkPermissions(config.permission, 'permission', errors);
  const perm = isObject(config.permission) ? config.permission : {};
  for (const tool of ['read', 'edit', 'bash', 'task']) {
    if (!isObject(perm[tool])) errors.push(`permission.${tool} debe ser un mapa explícito`);
  }

  const agentNames = Object.keys(agents);
  if (agentNames.length !== AGENTS.length || !AGENTS.every((n) => agents[n])) {
    errors.push('Debe haber exactamente los agentes build, coder, reviewer');
  }

  for (const [name, a] of Object.entries(agents)) {
    const d = a.data;
    if (!d || typeof d !== 'object' || Array.isArray(d)) {
      errors.push(`Agente ${name}: frontmatter inválido`);
      continue;
    }
    if (typeof d.description !== 'string' || !d.description.trim() || d.description.length > MAX_DESC) {
      errors.push(`Agente ${name}: description debe ser string no vacío <=${MAX_DESC}`);
    }
    if (!AGENT_MODES.has(d.mode)) errors.push(`Agente ${name}: mode inválido`);
    if (name === 'build' && d.mode !== 'primary') errors.push('build debe tener mode: primary');
    if (name !== 'build' && d.mode === 'primary') errors.push(`Agente ${name}: solo build puede ser primary`);
    if (!a.body?.trim()) errors.push(`Agente ${name}: body vacío`);
    if ('model' in d) errors.push(`Agente ${name}: no hardcodear model`);
    if ('permission' in d) checkPermissions(d.permission, `agent.${name}.permission`, errors);
    if (d.permission?.read) errors.push(`Agente ${name}: no sobrescribir protección común de lectura`);
    const allowedOverrides = { build: [], coder: ['task'], reviewer: ['edit', 'task', 'bash'] }[name] || [];
    for (const tool of Object.keys(d.permission || {})) {
      if (!allowedOverrides.includes(tool)) errors.push(`Agente ${name}: override no permitido: ${tool}`);
    }
  }

  if (agents.coder?.data?.permission?.task !== 'deny') errors.push('coder: permission.task debe ser deny');

  const rperm = agents.reviewer?.data?.permission || {};
  if (rperm.edit !== 'deny') errors.push('reviewer: permission.edit debe ser deny');
  if (rperm.task !== 'deny') errors.push('reviewer: permission.task debe ser deny');
  const rbash = rperm.bash;
  if (!isObject(rbash)) errors.push('reviewer: bash debe ser un mapa explícito');
  if (rbash && typeof rbash === 'object' && !Array.isArray(rbash)) {
    const keys = Object.keys(rbash);
    if (keys[0] !== '*') errors.push('reviewer bash: la primera clave debe ser "*"');
    if (rbash['*'] !== 'deny') errors.push('reviewer: bash["*"] debe ser deny');
    for (const k of keys) {
      if (k !== '*' && !REVIEWER_BASH_WHITELIST.has(k)) errors.push(`reviewer bash regla no permitida: ${k}`);
    }
    for (const k of REVIEWER_BASH_WHITELIST) if (rbash[k] !== 'allow') errors.push(`reviewer bash falta allow: ${k}`);
  }

  if (Object.keys(skills).length !== SKILLS.length) errors.push('Debe haber exactamente 4 skills');
  for (const name of SKILLS) if (!skills[name]) errors.push(`Falta skill ${name}`);
  const names = [];
  for (const [name, s] of Object.entries(skills)) {
    const d = s.data;
    if (!d || typeof d !== 'object' || Array.isArray(d)) {
      errors.push(`Skill ${name}: frontmatter inválido`);
      continue;
    }
    names.push(d.name);
    if (d.name !== name) errors.push(`Skill ${name}: name debe coincidir con carpeta`);
    if (typeof d.name !== 'string' || !NAME_RE.test(d.name) || d.name.length > MAX_NAME) {
      errors.push(`Skill ${name}: name inválido`);
    }
    if (typeof d.description !== 'string' || !d.description.trim() || d.description.length > MAX_DESC) {
      errors.push(`Skill ${name}: description debe ser string no vacío <=${MAX_DESC}`);
    }
    if (!s.body?.trim()) errors.push(`Skill ${name}: body vacío`);
  }
  if (new Set(names).size !== names.length) errors.push('Nombres de skill duplicados');

  const bash = perm.bash;
  if (bash && typeof bash === 'object' && !Array.isArray(bash)) {
    const keys = Object.keys(bash);
    if (keys[0] !== '*') errors.push('bash: la primera clave debe ser "*"');
    if (bash['*'] !== 'ask') errors.push('bash["*"] debe ser ask');
    for (const [p, v] of Object.entries(bash)) {
      if (v === 'allow') {
        if (/[*?]/.test(p)) errors.push(`bash allow con wildcard: ${p}`);
        else if (!GLOBAL_BASH_WHITELIST.has(p)) errors.push(`bash allow no permitido: ${p}`);
      }
      if (p !== '*' && !GLOBAL_BASH_WHITELIST.has(p) && !DESTRUCTIVE_RULES.includes(p)) {
        errors.push(`bash regla fuera del contrato local: ${p}`);
      }
    }
    for (const k of GLOBAL_BASH_WHITELIST) if (bash[k] !== 'allow') errors.push(`bash falta allow: ${k}`);
    for (const k of DESTRUCTIVE_RULES) if (bash[k] !== 'deny') errors.push(`bash falta deny: ${k}`);
  }

  const secrets = [
    ['.env', 'deny'],
    ['.env.local', 'deny'],
    ['.env.production', 'deny'],
    ['.env.example', 'allow'],
    ['service-account.json', 'deny'],
    ['credentials.json', 'deny'],
    ['key.pem', 'deny'],
    ['id_rsa.key', 'deny'],
    ['cert.p12', 'deny'],
    ['cert.pfx', 'deny'],
  ];
  for (const kind of ['read', 'edit']) {
    const map = perm[kind];
    if (!map || typeof map !== 'object' || Array.isArray(map)) continue;
    for (const [pattern, action] of Object.entries(SECRET_RULES)) {
      if (map[pattern] !== action) errors.push(`${kind} regla ${pattern} debe ser ${action}`);
    }
    for (const [pattern, action] of Object.entries(map)) {
      if (action === 'allow' && !['*', '*.env.example'].includes(pattern)) {
        errors.push(`${kind} allow fuera del contrato local: ${pattern}`);
      }
      if (action === 'ask' && !(kind === 'edit' && ['.opencode/*', '*/.opencode/*'].includes(pattern))) {
        errors.push(`${kind} ask fuera del contrato local: ${pattern}`);
      }
    }
    for (const [t, e] of secrets) {
      for (const path of [t, `server/${t}`, `/workspace/server/${t}`, `.opencode/${t}`, `/workspace/.opencode/${t}`]) {
        if (resolvePermission(path, map) !== e) errors.push(`${kind} ${path} debe ser ${e}`);
      }
    }
  }

  const editMap = perm.edit;
  if (editMap && typeof editMap === 'object' && !Array.isArray(editMap)) {
    for (const [t, e] of [['node_modules/.env.example', 'deny'], ['.git/config', 'deny'], ['dist/.env.example', 'deny'], ['.opencode/opencode.json', 'ask']]) {
      for (const path of [t, `/workspace/${t}`]) {
        if (resolvePermission(path, editMap) !== e) errors.push(`edit ${path} debe ser ${e}`);
      }
    }
  }

  const taskRules = { '*': 'deny', explore: 'allow', coder: 'allow', reviewer: 'allow', general: 'ask' };
  if (JSON.stringify(perm.task) !== JSON.stringify(taskRules)) errors.push('task debe conservar fallback deny y destinos explícitos');
  for (const [agent, expected] of Object.entries(taskRules)) {
    if (resolvePermission(agent, perm.task) !== expected) errors.push(`task ${agent} debe ser ${expected}`);
  }
  for (const tool of ['external_directory', 'doom_loop']) {
    if (perm[tool] !== 'ask') errors.push(`${tool} debe ser ask`);
  }

  return { ok: errors.length === 0, errors };
}

export function validateProject(opts = {}) {
  const scriptFile = fileURLToPath(import.meta.url);
  const root = opts.root ? resolve(opts.root) : resolve(dirname(scriptFile), '../..');
  const { config, agents, skills, workspaceReal } = loadProject(root);
  return validateRules(config, agents, skills, { root, workspaceReal });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = validateProject();
    if (result.ok) {
      console.log(
        'contratos locales válidos: la configuración cumple las comprobaciones internas. ' +
          'Esto no sustituye el esquema oficial ni las validaciones de runtime.'
      );
      process.exit(0);
    }
    console.error('Validación fallida:');
    for (const e of result.errors) console.error(`- ${e}`);
    process.exit(1);
  } catch (err) {
    console.error('Error ejecutando validación:', err.message);
    process.exit(1);
  }
}
