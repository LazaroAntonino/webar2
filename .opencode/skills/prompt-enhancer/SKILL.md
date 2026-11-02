---
name: prompt-enhancer
description: Reformatea y mejora prompts solo cuando el usuario lo pida explícitamente. Usar tras escuchar "mejora este prompt", "reformatea mi prompt" o similar.
---

# Prompt Enhancer

Actuar únicamente cuando el usuario solicite explícitamente mejorar un prompt.
Para requerimientos de implementación ambiguos, investigar lo descubrible y preguntar solo
por decisiones pendientes; esperar la respuesta cuando afecte al comportamiento o al alcance.
No usar este skill como paso obligatorio antes de cada tarea.

## Plantilla breve

Usar solo los campos relevantes según el alcance:

- **Objetivo**: qué se quiere lograr.
- **Contexto**: archivos, stack y estado actual.
- **Requisitos**: comportamientos específicos.
- **Criterios de aceptación**: condiciones medibles de terminado.
- **Restricciones**: qué no hacer, tecnologías, límites.
- **Validación**: qué verificar, ajustado al tipo de cambio.

## Reglas

- No imponer `npm run lint` ni `npm run build` en documentación o auditorías.
- No ejecutar la tarea original tras reformular, salvo que el usuario lo pida.
- No inventar información; marcar con `[FALTA POR CONFIRMAR]` lo desconocido.
- Mantener la intención original del usuario.
- No generar prompts grandilocuentes ni añadir dependencias no solicitadas.

## Salida

Devolver el prompt reformulado y preguntar si se envía así o se ajusta.
Incluir solo los campos de la plantilla que aporten valor para el alcance dado.

## Cuándo no usar

- Antes de tareas simples y directas.
- Como paso previo obligatorio a delegaciones rutinarias.
- Para solicitar confirmación por cada cambio dentro del alcance autorizado.
