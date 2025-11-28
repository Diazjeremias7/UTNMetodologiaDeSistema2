# Patrones Decorator y Observer en el Proyecto

## Patrón Decorator

### ¿Cómo se agregan los extras al servicio?

Los extras se agregan mediante decoradores que envuelven la reserva base:

- Una reserva básica tiene un costo base
- Cada extra (iluminación, equipamiento, árbitro, bebidas) se implementa como un decorador
- Los decoradores se aplican de forma encadenada
- Cada decorador añade funcionalidad y costo adicional

Ejemplo:
```
ReservaBase ($1000)
→ + DecoradorIluminacion ($300)
→ + DecoradorEquipamiento ($200)
= Total: $1500
```

### ¿Por qué se toma la decisión de hacerlo de esta manera?

1. **Evita explosión combinatoria:** Sin Decorator necesitaríamos una clase por cada combinación de extras

2. **Principio Abierto/Cerrado:** Se pueden agregar nuevos extras sin modificar código existente

3. **Flexibilidad:** Los usuarios eligen solo los extras que necesitan

4. **Cálculo transparente:** Cada decorador suma su costo al total

5. **Mantenibilidad:** Cada extra tiene lógica independiente

6. **Reutilización:** Los mismos decoradores funcionan para diferentes tipos de canchas

## Patrón Observer

### ¿Qué se va a notificar a los usuarios?

1. **Confirmación de reserva:** Cuando se crea una nueva reserva
2. **Recordatorios:** 24 horas y 2 horas antes de la reserva
3. **Cancelaciones:** Por usuario o administrador de cancha
4. **Modificaciones:** Cambios en horario o servicios
5. **Estado de pagos:** Confirmaciones, recordatorios, reembolsos
6. **Disponibilidad:** Alertas de canchas favoritas
7. **Promociones:** Ofertas especiales

### ¿Por qué medio?

Múltiples observadores para diferentes canales:

**Email (Observador Email):**
- Notificaciones formales y detalladas
- Confirmaciones con comprobantes
- Canal principal para comunicaciones oficiales

**SMS (Observador SMS):**
- Alertas urgentes
- Recordatorios inmediatos
- Alta tasa de apertura

**Notificaciones Push (Observador Push):**
- Alertas en tiempo real en móviles
- Interacción rápida
- No requiere app abierta

**Notificaciones In-App (Observador InApp):**
- Bandeja dentro del sistema
- Historial completo
- Siempre disponible

Arquitectura:
```
Evento (ReservaCreada)
    ↓
NotificadorCentral
    ↓
├── ObserverEmail
├── ObserverSMS
├── ObserverPush
└── ObserverInApp
```

## ¿Quién gestiona las reservas?

Modelo de gestión distribuida en tres niveles:

**1. Usuarios (Clientes):**
- Crean sus reservas
- Cancelan dentro de políticas
- Consultan historial

**2. Administradores de Canchas:**
- Gestionan sus canchas específicas
- Cancelan con justificación
- Configuran precios y servicios

**3. Super Administrador:**
- Supervisión general
- Resolución de disputas
- Configuración de políticas

## ¿Existirá un administrador?

Sí, jerarquía de roles:

### Super Administrador

**Responsabilidades:**
- Gestión completa del sistema
- Aprobación de nuevas canchas
- Alta/baja de administradores
- Resolución de disputas
- Configuración global
- Reportes de toda la plataforma
- Gestión de usuarios
- Mantenimiento técnico
- Monitoreo de transacciones

### Administrador de Cancha

Cada cancha tiene su administrador específico con permisos limitados.

## ¿Las canchas tendrán rol de administrador?

Sí, cada cancha tiene su administrador con funcionalidades específicas:

### Gestión de Disponibilidad
- Definir horarios de apertura/cierre
- Establecer días no laborables
- Bloquear fechas por mantenimiento
- Crear horarios especiales
- Establecer horarios pico con precios diferenciados
- Configurar duración de reservas

### Gestión de Reservas
- Visualizar todas las reservas de su cancha
- Cancelar por causas justificadas
- Modificar con consentimiento del usuario
- Confirmar/rechazar solicitudes
- Gestionar listas de espera
- Marcar no-shows
- Crear reservas administrativas

### Configuración de Servicios
- Definir extras disponibles
- Establecer precios de extras
- Activar/desactivar servicios
- Configurar precios según día/horario
- Establecer políticas de cancelación
- Definir descuentos

### Gestión Financiera
- Visualizar ingresos
- Consultar comisiones
- Configurar métodos de cobro
- Gestionar reembolsos
- Exportar reportes

### Reportes
- Tasa de ocupación
- Horarios populares
- Ingresos por extra
- Clientes frecuentes
- Tasa de cancelación
- Comparativas periódicas

### Gestión de Información
- Actualizar descripción y fotos
- Modificar características
- Gestionar reseñas
- Responder consultas

