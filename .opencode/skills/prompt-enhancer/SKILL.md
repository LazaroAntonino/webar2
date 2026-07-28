---
name: prompt-enhancer
description: Reformatea y mejora prompts del usuario antes de ejecutar cualquier tarea de codigo. Usar cuando el prompt sea vago, ambiguo, incompleto o cuando se quiera maximizar la calidad de la respuesta.
---

# Prompt Enhancer Skill

## Cuándo Usar

- Antes de ejecutar cualquier tarea compleja o ambigua
- Cuando el prompt del usuario sea demasiado corto o poco especifico
- Cuando falte contexto, criterios de exito o restricciones
- Cuando el usuario pida explicitamente "mejora este prompt" o "reformatea mi prompt"
- Antes de delegar a subagentes como `coder` o `reviewer`

## Proceso de Reformateo

### 1. Analizar la Intencion
- Identificar el objetivo principal del usuario
- Detectar lo que realmente quiere lograr
- Identificar el tipo de tarea (crear, modificar, refactorizar, revisar, depurar, optimizar)

### 2. Detectar lo que Falta
Marcar como incompleto si falta alguno de estos elementos:

- **Objetivo claro**: Que se quiere lograr exactamente
- **Contexto**: Archivos, componentes o partes del proyecto involucradas
- **Criterios de exito**: Como saber que la tarea esta terminada correctamente
- **Restricciones**: Que NO se debe hacer, tecnologias a usar, estilos a respetar
- **Prioridades**: Que es mas importante (calidad, velocidad, compatibilidad, etc.)
- **Entregables**: Que archivos, funciones o cambios se esperan

### 3. Estructurar el Prompt Mejorado

Usar esta plantilla obligatoriamente:

```markdown
## Objetivo
[Descripcion clara y concisa de lo que se quiere lograr]

## Contexto
- Proyecto: [tipo de proyecto, stack tecnologico]
- Archivos relevantes: [lista de archivos si se conocen]
- Estado actual: [breve descripcion del codigo o situacion actual]
- Dependencias: [librerias, APIs o modulos relacionados]

## Requisitos
1. [Requisito especifico 1]
2. [Requisito especifico 2]
3. [Requisito especifico 3]

## Criterios de Exito
- [ ] [Criterio medible 1]
- [ ] [Criterio medible 2]
- [ ] [Criterio medible 3]

## Restricciones
- [Restriccion 1]
- [Restriccion 2]

## Pasos Sugeridos (opcional)
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

## Verificacion Obligatoria
- Ejecutar `npm run lint` despues de los cambios
- Ejecutar `npm run build` si hay cambios significativos
- Confirmar que no hay errores en consola
```

### 4. Aplicar Mejores Practicas de Prompting

- Usar verbos de accion claros: crear, refactorizar, implementar, corregir, revisar
- Ser especifico con nombres de archivos, componentes y funciones
- Incluir ejemplos si ayuda a clarificar
- Definir el formato de salida esperado
- Evitar ambiguedades
- No asumir conocimiento que el modelo no tiene

### 5. Verificar Antes de Enviar

El prompt reformateado debe cumplir con:

```
[ ] Tiene un objetivo claro y unico
[ ] Incluye contexto suficiente
[ ] Define criterios de exito medibles
[ ] Menciona las restricciones
[ ] Indica las verificaciones obligatorias (lint, build)
[ ] Es lo suficientemente especifico para ejecutarse sin preguntas adicionales
```

## Ejemplo de Reformateo

### Prompt original (vago)
```
mejora el login
```

### Prompt reformateado
```markdown
## Objetivo
Mejorar la funcionalidad y experiencia de usuario del formulario de login existente.

## Contexto
- Proyecto: Aplicacion web con React 18 y JavaScript
- Archivo relevante: `src/components/LoginForm.jsx`
- Estado actual: Formulario basico con campos de email y password, sin validaciones visuales ni manejo de errores

## Requisitos
1. Agregar validacion de email con mensaje de error especifico
2. Mostrar/ocultar la contrasena con un boton de toggle
3. Mostrar spinner de carga durante el submit
4. Mostrar mensaje de error si el login falla
5. Mantener el diseno actual y las convenciones del proyecto

## Criterios de Exito
- [ ] El formulario valida el email antes de enviar
- [ ] El toggle de contrasena funciona correctamente
- [ ] Se muestra feedback visual durante el login
- [ ] Los errores del servidor se muestran al usuario
- [ ] `npm run lint` pasa sin errores
- [ ] `npm run build` compila correctamente

## Restricciones
- No cambiar la estructura de props del componente
- No agregar nuevas dependencias sin consultar
- Usar hooks de React (useState, useEffect) segun las convenciones del proyecto

## Verificacion Obligatoria
- Ejecutar `npm run lint` despues de los cambios
- Ejecutar `npm run build` si hay cambios significativos
```

## Reglas Importantes

1. **NO ejecutar la tarea**: Este skill solo reformatea el prompt, no realiza cambios de codigo
2. **Pedir confirmacion**: Mostrar el prompt mejorado al usuario y preguntar si quiere enviarlo o hacer ajustes
3. **No inventar informacion**: Si falta contexto importante, indicarlo en el prompt mejorado como `[FALTA POR CONFIRMAR]` en lugar de suponer
4. **Mantener la intencion original**: No cambiar el objetivo del usuario, solo clarificarlo
5. **Priorizar claridad sobre longitud**: Un prompt mas largo y claro es mejor que uno corto y ambiguo
6. **Incluir siempre verificacion**: Todo prompt de codigo debe terminar con ejecucion de `npm run lint` y `npm run build` cuando aplique
