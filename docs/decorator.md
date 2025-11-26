# Patrón Decorator - Servicios Adicionales

## Propósito
Permitir agregar servicios extras a las reservas sin modificar la clase base.

## Implementación

### Reserva Básica
- Precio base: $10,000
- Sin servicios adicionales

### Servicios Disponibles
1. **Iluminación**: +$2,000
2. **Árbitro**: +$5,000
3. **Pelotas**: +$1,000

## Ejemplo de Uso
```typescript
// Crear reserva básica
let reserva = new BasicReservation(1, '2025-01-20', '18:00-19:00');

// Agregar servicios
reserva = new LightingDecorator(reserva);
reserva = new RefereeDecorator(reserva);

// Precio total: $17,000
console.log(reserva.getPrice());
```

## Ventajas
- ✅ Extensible: fácil agregar nuevos servicios
- ✅ Flexible: combinar servicios dinámicamente
- ✅ SOLID: respeta Open/Closed Principle