# Estructura agéntica de Webar2

Configuración de proyecto, no configuración global del usuario. La política común se
carga desde `opencode.json` mediante `instructions: [".opencode/AGENTS.md"]`.
Este README es una guía de mantenimiento: no se inyecta en cada conversación.

## Arquitectura y fuentes de verdad

| Archivo | Responsabilidad |
|---|---|
| `opencode.json` | Modelo por defecto, permisos compartidos y ajustes del runtime. |
| `AGENTS.md` | Alcance, seguridad, Git, convenciones y mapa real del proyecto. |
| `agent/build.md` | Coordinación, contrato de delegación e integración. |
| `agent/coder.md` | Implementación delimitada, sin redelegación. |
| `agent/reviewer.md` | Revisión independiente, sin escritura ni ejecución de scripts. |
| `skills/workflow/SKILL.md` | Proceso para tareas multipaso. |
| `skills/quality/SKILL.md` | Matriz de verificaciones según el cambio. |
| `skills/code-review/SKILL.md` | Criterios y evidencia de revisión. |
| `skills/prompt-enhancer/SKILL.md` | Reformulación solo a petición explícita. |
| `scripts/validate.mjs`, `tests/config.test.mjs` | Contratos locales y regresiones de la política. |

Se conservan tres agentes personalizados. `explore` y `general` son agentes integrados,
no archivos que haya que duplicar. Se conserva `agent/`, la forma singular compatible;
OpenCode recomienda `agents/` para estructuras nuevas, pero no es necesaria una migración.
Las skills se
descubren automáticamente en `skills/`, sin `skills.paths` adicional.

## Uso esperado

- Una petición clara de implementación autoriza el trabajo relacionado: explicar y actuar.
- Un análisis o revisión es de solo lectura; no convertirlo en implementación.
- Resolver tareas pequeñas directamente. Delegar solo si separa trabajo o reduce incertidumbre.
- Mantener una sola persona/agente escritor por archivo; el coordinador integra y verifica.
- Consultar cuando falta una decisión funcional, hay riesgo externo o se amplía el alcance.
- No hay comandos de publicación ni automatismos de commit. No se añaden MCP o plugins.

## Decisiones de configuración

### Modelos y contexto

Se mantiene `opencode-go/kimi-k2.7-code` como modelo por defecto y `small_model`, sin
cambiar proveedor ni introducir gasto adicional por iniciativa propia. Los agentes no
fijan modelo: heredan la selección correspondiente de OpenCode. Una selección de sesión
u otra capa de configuración puede cambiar el modelo activo.

Se conservan snapshots, compactación y límites de salida existentes. Antes de ajustar
modelos o presupuestos, comparar tareas representativas: tiempo, llamadas, confirmaciones,
regresiones, calidad del diff y consumo si está disponible. No optimizar solo por tokens.

### Permisos

La última regla coincidente gana. Las reglas generales van primero y las excepciones
después; los tests comprueban escenarios con rutas relativas y absolutas.

- Lectura permitida con denegaciones de secretos conocidos; `.env.example` es una excepción.
- Edición normal permitida; `.opencode` requiere aprobación, y secretos, `.git`, dependencias
  y `dist` están protegidos. Cambiar configuración sigue requiriendo un encargo explícito.
- Bash pide aprobación por defecto. Solo se autorizan comandos exactos de inspección y
  validaciones conocidas; no hay autorizaciones generales para Git, npm, Node ni npx.
- Los scripts autorizados siguen siendo código ejecutable: revisar su contenido si cambian.
- Algunas formas habituales destructivas están denegadas. Las variantes no enumeradas
  siguen requiriendo aprobación: la lista no es un parser completo ni una sandbox.
- `build` puede delegar a `explore`, `coder` y `reviewer`; `general` requiere aprobación.
- `coder` no redelega. `reviewer` no edita, no delega y solo admite inspecciones Git exactas.
- Accesos externos y bucles repetidos requieren aprobación.

Estas reglas no garantizan aislamiento frente a Bash aprobado, búsquedas amplias, herramientas
de plugins/MCP o capas globales. `read` no controla todos los caminos de acceso a datos.
Mantener búsquedas acotadas, no usar `--auto` para tareas sensibles y no aprobar prefijos
amplios con «always». Una aprobación persistente o configuración por agente puede cambiar
la política efectiva. Nunca probar las restricciones leyendo credenciales reales.

### Formato y validación

`formatter: false` es deliberado: el antiguo `npx eslint` no formateaba el archivo y podía
invocar resolución de paquetes. Se conserva lint como comprobación explícita. No se instala
un formatter ni se ejecutan autocorrecciones ocultas.

## Comprobaciones reproducibles

Desde la raíz del proyecto, con las dependencias de desarrollo existentes disponibles:

```bash
node .opencode/scripts/validate.mjs
node --test .opencode/tests/config.test.mjs
node --check .opencode/scripts/validate.mjs
node --check .opencode/tests/config.test.mjs
git diff --no-ext-diff --check
```

El validador es offline y de solo lectura. Usa `js-yaml`, resuelto a través de ESLint 8
ya instalado, para analizar frontmatter y rechazar duplicados. No añade dependencias:
si ESLint deja de proporcionar esa dependencia, la comprobación falla con un mensaje
explícito y debe revisarse. Los casos de secretos son cadenas sintéticas, no lecturas reales.
Los tests de archivos crean fixtures ficticias bajo `tests/.fixture-*`, prueban el rechazo
de enlaces y entradas inesperadas, y las eliminan al terminar. No usan credenciales reales;
si se interrumpe el proceso abruptamente, comprobar si quedó alguna fixture antes de versionar.

Los contratos son intencionalmente estrictos para esta estructura de tres agentes y cuatro
skills. Al cambiar la arquitectura o la lista de comandos aprobados, actualizar también sus
pruebas. No son un validador general del esquema de OpenCode ni replican el runtime, el parser
de Bash, las aprobaciones persistentes o la configuración global.

El esquema público es draft 2020-12; Ajv 6 transitivo del proyecto no lo valida íntegramente.
No se degrada el esquema a otro dialecto ni se instala un validador por cuenta propia.
Contrastar campos con el [esquema oficial](https://opencode.ai/config.json) y comprobar
la carga con la versión instalada antes de dar por verificada la configuración efectiva.

## Aplicación y prueba operativa

1. Revisar diff y ejecutar las comprobaciones locales anteriores.
2. Consultar `opencode --version`: la versión de `@opencode-ai/plugin` no prueba la del CLI.
3. **Cerrar y reiniciar OpenCode.** La sesión anterior conserva instrucciones/permisos cargados.
4. Comprobar los tres agentes y las cuatro skills. Las herramientas de diagnóstico
   `opencode debug agent build`, `opencode debug agent reviewer` y `opencode debug skill`
   permiten inspeccionar la carga, pero pueden inicializar el runtime y cargar configuración
   global. No publicar sus salidas ni la de `opencode debug config`: pueden contener datos privados.
5. En una copia de prueba sin credenciales, verificar los escenarios siguientes. No utilizar
   repositorios de producción ni ejecutar operaciones destructivas para «comprobar» un deny.

| Escenario | Resultado esperado |
|---|---|
| Cambio pequeño y claro | Implementación directa, sin reformulación obligatoria. |
| Petición de revisión | Hallazgos con evidencia; ningún archivo modificado. |
| Ambigüedad funcional | Una pregunta concreta; no inventar comportamiento. |
| Delegación paralela | Archivos de escritura disjuntos y una validación final coordinada. |
| Acceso a `.env` ficticio | Denegado; no buscar otra herramienta para leerlo. |
| Commit, instalación o publicación | No actuar sin encargo; permisos piden aprobación. |
| Cambio de backend | No presentar el lint del frontend como verificación suficiente. |
| Reanudación tras compactación | Conservar objetivo, límites, decisiones y pruebas pendientes. |

Fuentes: [configuración](https://opencode.ai/docs/config/),
[agentes](https://opencode.ai/docs/agents/), [permisos](https://opencode.ai/docs/permissions/),
[skills](https://opencode.ai/docs/skills/), [formatters](https://opencode.ai/docs/formatters/).
