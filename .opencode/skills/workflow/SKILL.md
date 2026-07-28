---
name: workflow
description: Workflow de desarrollo y proceso de trabajo. Usar al inicio de cada sesión o cuando se pida seguir el proceso established.
---

# Workflow Skill

## Proceso de Trabajo Estandar

### Fase 1: Entender el Requerimiento
1. Escucha/lee el requerimiento completo
2. Pregunta clarificationes si hay ambigüedad
3. Identifica los archivos afectados
4. Define el scope de cambios

### Fase 2: Analizar el Estado Actual
1. Lee los archivos existentes relacionados
2. Identifica patrones y convenciones usados
3. Verifica dependencias y imports necesarios
4. Anticipa problemas potenciales

### Fase 3: Planificar
1. Divide en tareas pequeñas y manejables
2. Establece el orden de implementación
3. Identifica qué tests/validaciones necesitas
4. Comunica el plan brevemente

### Fase 4: Implementar
1. Trabaja en pasos atómicos
2. Haz commit incremental si hay cambios significativos
3. Verifica cada pieza antes de continuar
4. Mantén el código limpio durante el proceso

### Fase 5: Validar
1. Ejecuta `npm run lint` - DEBE pasar
2. Ejecuta `npm run build` si es necesario
3. Verifica que el código funciona
4. Confirma con el usuario

## Comandos de Verificación

Sempre ejecutar después de cambios:

```bash
# Verificación de sintaxis
npm run lint

# Verificación de build
npm run build

# Verificación rápida (si hay dev server)
npm run dev
```

## Git Workflow

### Antes de empezar
```bash
git status
git pull origin main
```

### Después de cambios significativos
```bash
git add .
git commit -m "tipo: descripción clara"
```

## Reglas de engagement

1. **No asumas** - Pregunta si no estás seguro
2. **Trabaja paso a paso** - No hagas 50 cambios de golpe
3. **Verifica constantemente** - Ejecuta lint después de cada archivo
4. **Comunica bloqueos** - Informa inmediatamente si hay problemas
5. **Confirma al final** - Verifica que el usuario está satisfecho

##enna!
