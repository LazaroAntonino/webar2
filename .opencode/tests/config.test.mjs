import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseFrontmatter,
  resolvePermission,
  assertWithin,
  loadProject,
  validateRules,
  validateProject,
} from '../scripts/validate.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const { config, agents, skills, workspaceReal } = loadProject(root);
const opts = { root, workspaceReal };
const clone = (o) => JSON.parse(JSON.stringify(o));
const has = (r, re) => r.errors.some((e) => re.test(e));

// Fixtures locales y desechables; jamás copiar ni abrir credenciales reales.
function withFixture(run) {
  const temp = mkdtempSync(join(root, '.opencode/tests/.fixture-'));
  const dir = join(temp, '.opencode');
  try {
    mkdirSync(join(dir, 'agent'), { recursive: true });
    mkdirSync(join(dir, 'skills'));
    writeFileSync(join(dir, 'opencode.json'), JSON.stringify(config));
    writeFileSync(join(dir, 'AGENTS.md'), '# Instrucciones ficticias');
    for (const [name, agent] of Object.entries(agents)) writeFileSync(join(dir, 'agent', `${name}.md`), agent.raw);
    for (const [name, skill] of Object.entries(skills)) {
      mkdirSync(join(dir, 'skills', name));
      writeFileSync(join(dir, 'skills', name, 'SKILL.md'), skill.raw);
    }
    run(temp, dir);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

describe('validate', () => {
  it('valida el proyecto real e imprime mensaje de éxito', () => {
    const r = validateProject();
    assert(r.ok);
    assert.equal(r.errors.length, 0);
    const out = spawnSync(process.execPath, ['.opencode/scripts/validate.mjs'], {
      cwd: root,
      encoding: 'utf8',
    });
    assert(out.status === 0);
    assert(/contratos locales/.test(out.stdout));
    assert(/no sustituye el esquema oficial ni las validaciones de runtime/.test(out.stdout));
  });

  it('parsea frontmatter y rechaza YAML inválido, arrays, null y duplicados', () => {
    const s = skills['code-review'];
    assert.equal(s.data.name, 'code-review');
    assert(s.data.description.length > 0);
    assert(s.body.includes('Code Review'));
    assert.throws(() => parseFrontmatter('---\nname: [\n---\nbody'), /YAML|unexpected/i);
    assert.throws(() => parseFrontmatter('---\n- a\n---\nbody'), /objeto/);
    assert.throws(() => parseFrontmatter('---\nnull\n---\nbody'), /objeto/);
    assert.throws(() => parseFrontmatter('---\npermission:\n  edit: allow\n  edit: deny\n---\nbody'), /duplicated|duplic/);
    assert.throws(() => parseFrontmatter('---\nname: a\nname: b\n---\nbody'), /duplicated|duplic/);
  });

  it('assertWithin permite raíz e interior y rechaza fuera', () => {
    assertWithin('/workspace/.opencode', '/workspace');
    assertWithin('/workspace', '/workspace');
    assert.throws(() => assertWithin('/workspace-other/foo', '/workspace'), /fuera/);
    assert.throws(() => assertWithin('/workspace..', '/workspace'), /fuera/);
  });

  it('wildcard: orden malo filtra mal; orden correcto y override funcionan', () => {
    assert.equal(resolvePermission('.env', { '*.env': 'deny', '*': 'allow' }), 'allow');
    assert.equal(resolvePermission('.env', { '*': 'allow', '*.env': 'deny' }), 'deny');
    assert.equal(resolvePermission('x', { '*': 'allow' }, 'deny'), 'deny');
    assert.equal(resolvePermission('git reset --hard HEAD', { 'git reset --hard*': 'deny' }), 'deny');
    assert.equal(resolvePermission('git push -f origin main', { 'git push -f*': 'deny' }), 'deny');
    assert.equal(resolvePermission('a.js', { '?.js': 'allow' }), 'allow');
    assert.equal(resolvePermission('aXjs', { '?.js': 'allow' }), undefined);
  });

  it('políticas globales de permisos', () => {
    const r = config.permission.read;
    const e = config.permission.edit;
    const b = config.permission.bash;
    assert.equal(resolvePermission('.env', r), 'deny');
    assert.equal(resolvePermission('/project/.env', r), 'deny');
    assert.equal(resolvePermission('.env.example', r), 'allow');
    assert.equal(resolvePermission('service-account.json', r), 'deny');
    assert.equal(resolvePermission('id_rsa.key', r), 'deny');
    assert.equal(resolvePermission('node_modules/foo', e), 'deny');
    assert.equal(resolvePermission('/project/node_modules/pkg/.env.example', e), 'deny');
    assert.equal(resolvePermission('/project/dist/.env.example', e), 'deny');
    assert.equal(resolvePermission('.git/config', e), 'deny');
    assert.equal(resolvePermission('dist/index.html', e), 'deny');
    assert.equal(resolvePermission('.opencode/opencode.json', e), 'ask');
    assert.equal(resolvePermission('git status', b), 'allow');
    assert.equal(resolvePermission('npm run lint', b), 'allow');
    assert.equal(resolvePermission('node .opencode/scripts/validate.mjs', b), 'allow');
    assert.equal(resolvePermission('git add .', b), 'ask');
    assert.equal(resolvePermission('git commit -m x', b), 'ask');
    assert.equal(resolvePermission('git push', b), 'ask');
    assert.equal(resolvePermission('git pull origin main', b), 'ask');
    assert.equal(resolvePermission('git push --force', b), 'deny');
    assert.equal(resolvePermission('npm install', b), 'ask');
    assert.equal(resolvePermission('npx eslint', b), 'ask');
    assert.equal(resolvePermission('node arbitrary.js', b), 'ask');
  });

  it('reviewer aplica overrides restrictivos', () => {
    const rp = agents.reviewer.data.permission;
    assert.equal(resolvePermission('src/App.jsx', config.permission.edit, rp.edit), 'deny');
    assert.equal(resolvePermission('anything', config.permission.task, rp.task), 'deny');
    assert.equal(resolvePermission('npm run build', config.permission.bash, rp.bash), 'deny');
    assert.equal(resolvePermission('node server/server.js', config.permission.bash, rp.bash), 'deny');
    assert.equal(resolvePermission('git status', config.permission.bash, rp.bash), 'allow');
  });

  it('detecta tipos inválidos sin tirar TypeError', () => {
    const cfg = clone(config);
    cfg.permission.read = { '*': 'allow', '*.env': 123 };
    const r = validateRules(cfg, agents, skills, opts);
    assert(!r.ok);
    assert(has(r, /ask\/allow\/deny/));
    const ag = clone(agents);
    ag.coder.data.description = 42;
    ag.coder.data.mode = 'primary';
    ag.reviewer.data.permission.bash = { '*': 'deny', 'npm run build': 'allow' };
    const r2 = validateRules(config, ag, skills, opts);
    assert(has(r2, /description/));
    assert(has(r2, /solo build puede ser primary/));
    assert(has(r2, /reviewer bash regla no permitida/));
  });

  it('detecta skill con name/descripción/body inválidos', () => {
    const sk = clone(skills);
    sk['code-review'].data.name = 'code_review';
    sk['code-review'].data.description = 'x'.repeat(1025);
    sk['code-review'].body = '   ';
    sk['quality'].data.name = 'code-review';
    const r = validateRules(config, agents, sk, opts);
    assert(has(r, /name inválido/));
    assert(has(r, /description/));
    assert(has(r, /body vacío/));
    // La duplicación se comprueba por separado, no queda oculta por los otros errores.
    sk['code-review'].data.name = 'code-review';
    assert(has(validateRules(config, agents, sk, opts), /duplicad/));
  });

  it('detecta formatter activo', () => {
    const cfg = clone(config); cfg.formatter = true;
    assert(has(validateRules(cfg, agents, skills, opts), /formatter/));
  });

  it('detecta default_agent incorrecto', () => {
    const cfg = clone(config); cfg.default_agent = 'coder';
    assert(has(validateRules(cfg, agents, skills, opts), /default_agent/));
  });

  it('detecta agent definido también en JSON', () => {
    const cfg = clone(config); cfg.agent = {};
    assert(has(validateRules(cfg, agents, skills, opts), /No definir agent/));
  });

  it('detecta bash * no primero, allow amplio o extra', () => {
    const cfg = clone(config);
    const entries = Object.entries(cfg.permission.bash);
    cfg.permission.bash = Object.fromEntries([...entries.slice(1), entries[0]]);
    assert(has(validateRules(cfg, agents, skills, opts), /primera clave/));
    cfg.permission.bash = clone(config.permission.bash);
    cfg.permission.bash['git*'] = 'allow';
    assert(has(validateRules(cfg, agents, skills, opts), /wildcard/));
    cfg.permission.bash = clone(config.permission.bash);
    cfg.permission.bash['git reset --hard'] = 'allow';
    assert(has(validateRules(cfg, agents, skills, opts), /allow no permitido/));
  });

  it('detecta lectura de .env permitida', () => {
    const cfg = clone(config); cfg.permission.read['.env'] = 'allow';
    assert(has(validateRules(cfg, agents, skills, opts), /read.*\.env/));
  });

  it('detecta build no primary, coder task y reviewer edit sin deny', () => {
    const ag = clone(agents);
    ag.build.data.mode = 'subagent';
    assert(has(validateRules(config, ag, skills, opts), /build.*primary/));
    ag.build.data.mode = 'primary';
    delete ag.coder.data.permission.task;
    assert(has(validateRules(config, ag, skills, opts), /coder.*task/));
    ag.coder.data.permission.task = 'deny';
    delete ag.reviewer.data.permission.edit;
    assert(has(validateRules(config, ag, skills, opts), /reviewer.*edit/));
  });

  it('rechaza reglas ausentes, escalares permisivos y mapas anidados', () => {
    for (const tool of ['read', 'edit', 'bash', 'task']) {
      for (const bad of [undefined, null, 'allow', []]) {
        const cfg = clone(config);
        cfg.permission[tool] = bad;
        assert.equal(validateRules(cfg, agents, skills, opts).ok, false, `${tool}: ${bad}`);
      }
    }
    const cfg = clone(config);
    cfg.permission.read['*.env'] = { action: 'deny' };
    assert(has(validateRules(cfg, agents, skills, opts), /ask\/allow\/deny/));
    const ag = clone(agents);
    delete ag.reviewer.data.permission.bash;
    assert(has(validateRules(config, ag, skills, opts), /reviewer: bash/));
  });

  it('rechaza instrucciones vacías, permisos de lectura por agente y skills duplicadas', () => {
    const cfg = clone(config);
    cfg.instructions = [];
    assert(has(validateRules(cfg, agents, skills, opts), /instructions/));
    cfg.skills = { paths: ['.opencode/skills'] };
    assert(has(validateRules(cfg, agents, skills, opts), /descubrimiento/));
    const ag = clone(agents);
    ag.reviewer.data.permission.read = 'allow';
    assert(has(validateRules(config, ag, skills, opts), /protección común/));
  });

  it('rechaza overrides permisivos, secretos sin cobertura y delegación abierta', () => {
    const ag = clone(agents);
    ag.coder.data.permission.edit = 'allow';
    ag.coder.data.permission.bash = 'allow';
    const result = validateRules(config, ag, skills, opts);
    assert(has(result, /override no permitido: edit/));
    assert(has(result, /override no permitido: bash/));
    const cfg = clone(config);
    delete cfg.permission.read['*.env.*'];
    cfg.permission.read['*.env.local'] = 'deny';
    assert(has(validateRules(cfg, agents, skills, opts), /read regla/));
    cfg.permission.task['*'] = 'allow';
    cfg.permission.task.unknown = 'deny';
    assert(has(validateRules(cfg, agents, skills, opts), /fallback deny/));
  });

  it('conserva denegaciones destructivas en la configuración real', () => {
    for (const [pattern, command] of [
      ['git reset --hard*', 'git reset --hard HEAD'],
      ['git clean -f*', 'git clean -fd dist/'],
      ['git push --force*', 'git push --force origin main'],
      ['git push -f*', 'git push -f origin main'],
    ]) {
      assert.equal(resolvePermission(command, config.permission.bash), 'deny');
      for (const value of [undefined, 'ask']) {
        const cfg = clone(config);
        cfg.permission.bash[pattern] = value;
        assert(has(validateRules(cfg, agents, skills, opts), /bash falta deny/));
      }
    }
  });

  it('rechaza excepciones ask posteriores que debilitan denegaciones de secretos', () => {
    for (const tool of ['read', 'edit']) {
      const cfg = clone(config);
      cfg.permission[tool]['*.env.staging'] = 'ask';
      assert(has(validateRules(cfg, agents, skills, opts), /ask fuera del contrato/));
    }
    const cfg = clone(config);
    delete cfg.permission.edit['*/.opencode/*'];
    cfg.permission.edit['*/.opencode/*'] = 'ask';
    assert(has(validateRules(cfg, agents, skills, opts), /edit .*\.opencode/));
  });

  it('rechaza un archivo inesperado antes de intentar analizar su contenido', () => {
    withFixture((temp, dir) => {
      writeFileSync(join(dir, 'agent', '.env.backup.md'), 'Contenido ficticio que no debe leerse');
      assert.throws(() => loadProject(temp), /Entrada inesperada en agent/);
    });
  });

  it('rechaza aliases internos y externos antes de leer el destino', () => {
    for (const external of [false, true]) {
      withFixture((temp, dir) => {
        const target = external ? join(root, '.opencode/README.md') : join(temp, 'ficticio.txt');
        if (!external) writeFileSync(target, 'Contenido ficticio, no es configuración');
        const agentPath = join(dir, 'agent', 'coder.md');
        rmSync(agentPath);
        symlinkSync(target, agentPath);
        assert.throws(() => loadProject(temp), /Enlace simbólico no admitido|fuera del workspace/);
      });
    }
  });

  it('rechaza claves JSON duplicadas aunque JSON.parse las acepte', () => {
    withFixture((temp, dir) => {
      writeFileSync(join(dir, 'opencode.json'), '{"permission": {}, "permission": {}}');
      assert.throws(() => loadProject(temp), /duplicated/);
    });
  });
});
