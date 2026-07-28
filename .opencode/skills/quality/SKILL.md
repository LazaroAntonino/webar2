---
name: quality
description: Mantener calidad del código y evitar errores comunes. Usar antes de ogni commit o cuando se detecten problemas de calidad.
---

# Quality Skill

## Estándares de Calidad

### Código Limpio
- Sin console.log de debug
- Sin código comentado sin propósito
- Sin variables sin usar
- Funciones con un solo propósito

### React Best Practices
- Componentes pequeños y focused
- Custom hooks para lógica reutilizable
- Props typed (si se usa TypeScript)
- Error boundaries para componentes críticos

### Performance
- Evitar renders innecesarios
- Usar useMemo/useCallback cuando sea necesario
- Lazy loading para componentes pesados
- Optimizar imágenes y assets

### Security
- No hardcodear secrets
- Sanitizar inputs del usuario
- Usar HTTPS para APIs externas
- Validar datos en cliente y servidor

## Checkpoint de Calidad

Antes de finalizar cualquier tarea, verificar:

```
Calidad del código:
[ ] ¿El código es legible?
[ ] ¿Los nombres son descriptivos?
[ ] ¿Hay documentación necesaria?
[ ] ¿Se siguen las convenciones del proyecto?

Funcionalidad:
[ ] ¿El código hace lo que se espera?
[ ] ¿Maneja casos edge?
[ ] ¿Hay feedback para el usuario?
[ ] ¿Los errores están manejados?

Técnico:
[ ] ¿Lint pasa sin errores?
[ ] ¿Build successful?
[ ] ¿No hay warnings significativos?
[ ] ¿Dependencies actualizadas?
```

## Errores Críticos a Evitar

1. **Memory leaks**: Cleanup en useEffect, cancel subscriptions
2. **Race conditions**: Cancelar requests anteriores, verificar datos stale
3. **State inconsistencies**: Updates atómicos, evitar estado contradictorio
4. **Missing null checks**: Siempre verificar `data && data.items`
5. **Infinite loops**: Dependencias de useEffect bien definidas

##enna!
