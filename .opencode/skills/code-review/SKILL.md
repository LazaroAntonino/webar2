---
name: code-review
description: Revisa código para reportar bugs, riesgos y mejoras sin editar. Usar cuando se pida revisión o tras detectar comportamiento inesperado.
---

# Code Review

En modo revisión solo reportar hallazgos; devolver las correcciones al implementador.
Una petición de corregir no elimina los permisos de solo lectura del agente reviewer.
Prioridad: bugs reproducibles > riesgos funcionales > preferencias de estilo.
Cada observación debe ser accionable y estar fundamentada en evidencia.

## Formato de hallazgo

Para cada observación incluir:

- Archivo y líneas verificadas.
- Escenario concreto o input que lo dispare.
- Evidencia: código concreto, error, traza o comportamiento observado; no inventar una ejecución.
- Severidad: P1 (importante), P2 (acotado/condicional), P3 (opcional).
- Confianza: alta / media / baja.

## Focos de revisión

- React: dependencias reales de `useEffect` (`useState` no recibe un array de dependencias);
  operaciones asíncronas con manejo de errores donde corresponda.
- SSR e hidratación: inconsistencias entre servidor y cliente, uso seguro de `window`/`document`.
- Seguridad del backend: validación de entradas, escapes, headers y permisos.
- Performance: no sugerir `useMemo` por dogma; exigir evidencia de cuello de botella.

## Qué evitar

- `preventDefault()` universal en todos los handlers.
- Cambios de estilo sin justificación funcional.
- Corregir código directamente; proponer la corrección en el reporte.
- Reportar preferencias personales como errores.

## Ejemplo de reporte breve

```markdown
- [P2] archivo:líneas — título. Al ocurrir [condición], [código observado] provoca
  [impacto]. Evidencia: [referencia]. Confianza: [nivel]. Corrección sugerida: [acción].
```
