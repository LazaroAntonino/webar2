---
name: quality
description: Define la matriz de validación del proyecto y distingue warnings preexistentes de nuevos. Usar antes de entregar cambios o cuando se precise elegir el método de verificación correcto.
---

# Quality

Esta skill es la fuente única para decidir qué validación aplica a cada tipo de cambio.
No prometer cero bugs ni consola limpia sin navegador.
Distinguir warnings nuevos, preexistentes y de origen no determinado; no atribuirlos sin evidencia.
Aplicar solo las verificaciones que correspondan al alcance autorizado.

## Matriz de validación

| Tipo de cambio | Verificación |
|---|---|
| Frontend React/JS | `npm run lint` + `npm run build` + casos de UI relevantes |
| SSG / SEO | Lint si cambia JS/JSX, `npm run build` + `npm run audit` (no confundir con `npm audit`) |
| Backend `server/server.js` | `node --check server/server.js` para sintaxis; pruebas aisladas sin escribir en Google real |
| Scripts/config OpenCode | `node .opencode/scripts/validate.mjs` + `node --test .opencode/tests/config.test.mjs`; contrastar esquema y comprobar carga en una nueva sesión |
| Documentación | Revisar enlaces y diff; no build rutina |

## Reglas generales

- Informar si los warnings son preexistentes o introducidos por los cambios.
- Los scripts nuevos fuera del lint del proyecto deben comprobarse con `node --check` o tests.
- Si una validación falla, reportar el error concreto y su alcance antes de proponer corrección.
- Coordinar con el agente principal las validaciones globales; no repetirlas por cada archivo o subagente.
- Preferir pruebas aisladas sobre acciones contra servicios reales.

## Qué no hacer

- No usar `npm audit` en lugar de `npm run audit`.
- No validar el backend solo con `npm run lint` desde la raíz.
- No asumir que el build limpio garantiza ausencia de bugs de runtime.
- No reportar warnings preexistentes como si fueran nuevos.

## Reporte de resultados

- Indicar qué comandos se ejecutaron y con qué resultado.
- Separar errores y warnings nuevos, preexistentes y de origen no determinado.
- Mencionar si una validación quedó fuera del alcance autorizado.
- El lint raíz permite hasta cinco warnings y excluye `server/**` y `scripts/**`; no es validación total.
- El build depende de datos remotos; un fallo de red no demuestra un fallo de código. La auditoría SEO requiere `dist` actualizado.

## Scripts fuera de cobertura

Si un archivo nuevo no está cubierto por `npm run lint`, verificar su sintaxis con `node --check`.
Si tiene tests, ejecutarlos con `node --test` en el directorio correspondiente.
