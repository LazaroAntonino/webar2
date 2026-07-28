---
name: code-review
description: Revisar código JavaScript/React para detectar errores, bugs y mejoras. Usar después de escribir código o cuando se pida revisión.
---

# Code Review Skill

## Cuándo Usar

- Después de escribir código nuevo
- Antes de hacer commit
- Cuando se detecten comportamientos inesperados
- Petición explícita de "revisa este código"

## Proceso de Revisión

### 1. Revisión de Sintaxis
- Verificar paréntesis, llaves, corchetes balanceados
- Confirmar tags JSX cerrados correctamente
- Validar imports/exports

### 2. Revisión de Lógica React
- `useState` con valor inicial correcto
- `useEffect` con dependencias apropiadas
- Cleanup functions cuando corresponde
- Avoid mental renders

### 3. Revisión de Best Practices
- No usar `any` sin justificación
- Props con default values
- Error boundaries donde sea necesario
- Loading states apropiados

### 4. Checklist de Errores Comunes

```
[ ] ¿Los componentes tienen valores iniciales para useState?
[ ] ¿Los useEffect tienen array de dependencias correcto?
[ ] ¿Se limpian subscriptions en cleanup?
[ ] ¿Hay console.log de debug?
[ ] ¿Hay imports faltantes?
[ ] ¿Los handlers de eventos tienen e.preventDefault()?
[ ] ¿Las funciones async tienen try/catch?
[ ] ¿Los optional chaining están bien usados?
```

## Ejemplo de Output

```markdown
## Code Review: PropertyDetail.jsx

### ✅ Correcto
- Componente funcional con hooks
- useState inicializado correctamente
- useEffect con dependencias

### ⚠️ Mejoras
- Linea 45: Considerar usar useMemo para cálculo expensive
- Linea 78: Falta validación de prop `id`

### ❌ Errores
- Linea 112: `items.map` sin verificación de null
- Linea 156: useEffect missing dependency: `fetchData`
```

## Reglas

1. Si encuentras errores CRÍTICOS, corrígelos INMEDIATAMENTE
2. Sugiere mejoras pero no Reescribas código sin necesidad
3. Prioriza: errores > warnings > mejoras
4. Explica el "por qué" de cada observación
