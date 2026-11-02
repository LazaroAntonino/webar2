---
name: workflow
description: Coordina tareas multipaso, planificación, delegación y verificación global. Usar cuando una tarea requiera dividirse en pasos, asignar archivos o coordinar validaciones finales.
---

# Workflow

Aplicar solo cuando el trabajo requiera más de un paso coordinado.
No usar para tareas de una sola edición o consulta directa.
Mantener una sola fuente de verdad para el plan, los archivos asignados y las decisiones tomadas.

## Planificación

1. Dividir la tarea en pasos concretos, ordenados y asignables.
2. Establecer propiedad exclusiva de archivos para evitar ediciones simultáneas.
3. Identificar dependencias entre pasos y posibles bloqueos.
4. Comunicar el plan de forma breve.
5. No pedir confirmación por cada paso rutinario; actuar dentro del alcance autorizado.

## Delegación

- Delegar a subagentes cuando el paso justifique una propiedad separada o conocimiento especializado.
- Transferir siempre: alcance autorizado, archivos afectados, decisiones previas y restricciones activas.
- No delegar tareas triviales que se resuelvan más rápido directamente.
- El agente principal conserva la propiedad del plan y coordina la integración.

## Ejecución

- Trabajar en pasos atómicos y verificables.
- Respetar estrictamente el alcance autorizado; si surge algo fuera de él, reportar sin actuar.
- Documentar decisiones, cambios de rumbo y restricciones activas para garantizar continuidad.
- Si un paso falla, informar antes de continuar con los dependientes.

## Verificación global

- Coordinar las validaciones finales una vez completados todos los pasos.
- No ejecutar `git pull`, `git add`, `git commit` ni push automáticos.
- Entregar un resumen claro de lo realizado, decisiones tomadas y restricciones pendientes.
- Asegurar que el contexto de continuidad quede disponible para la siguiente sesión.

## Restricciones de alcance

- No modificar archivos fuera de los acordados.
- No realizar operaciones de Git mutadoras sin instrucción explícita.
- No solicitar confirmación por acciones rutinarias dentro del alcance.
