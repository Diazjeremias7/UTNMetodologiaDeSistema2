# Patrones Decorator y Observer en el Proyecto

## Patrón Decorator ✅ IMPLEMENTADO

### ¿Cómo se agregan los extras al servicio?

**Código en `backend/src/models/Reservation.ts`:**

```typescript
// Reserva base
class BasicReservation {
  protected basePrice = 10000;
  getPrice() { return this.basePrice; }
}

// Decoradores concretos
class LightingDecorator extends ReservationDecorator {
  private lightingCost = 2000;
  getPrice() { return this.reservation.getPrice() + this.lightingCost; }
}

class RefereeDecorator extends ReservationDecorator {
  private refereeCost = 5000;
  getPrice() { return this.reservation.getPrice() + this.refereeCost; }
}

class BallsDecorator extends ReservationDecorator {
  private ballsCost = 1000;
  getPrice() { return this.reservation.getPrice() + this.ballsCost; }
}
```

**Aplicación en `backend/src/services/ReservationService.ts`:**

```typescript
let reservation = new BasicReservation(userId, date, timeSlot);

// Aplicar decoradores según servicios solicitados
services.forEach(service => {
  switch (service.toLowerCase()) {
    case 'iluminación': reservation = new LightingDecorator(reservation); break;
    case 'árbitro': reservation = new RefereeDecorator(reservation); break;
    case 'pelotas': reservation = new BallsDecorator(reservation); break;
  }
});

const totalPrice = reservation.getPrice(); // $10,000 + extras
```

**Ejemplo:** Base ($10,000) + Iluminación ($2,000) + Árbitro ($5,000) = **$17,000**

### ¿Por qué se toma la decisión de hacerlo de esta manera?

1. **Evita explosión combinatoria:** 3 decoradores = 7 combinaciones vs. 7 clases separadas
2. **Principio Abierto/Cerrado:** Agregar nuevos servicios sin modificar código existente
3. **Flexibilidad:** Los usuarios eligen dinámicamente qué extras agregar
4. **Cálculo transparente:** Cada decorador suma su costo independientemente

## Patrón Observer 📋 PLANIFICADO (No implementado aún)

### ¿Qué se va a notificar a los usuarios?

1. **Confirmación de reserva** al crearla
2. **Recordatorios** 24h y 2h antes
3. **Cancelaciones** por usuario o admin
4. **Modificaciones** en horario/servicios

### ¿Por qué medio?

**Arquitectura multicanal planificada:**

```typescript
// Implementación futura
class ReservationNotifier {
  private observers: Observer[] = [];
  
  notify(event: ReservationEvent) {
    this.observers.forEach(obs => obs.update(event));
  }
}

// Observadores concretos
class EmailObserver { update(event) { /* Envía email */ } }
class SMSObserver { update(event) { /* Envía SMS */ } }
class PushObserver { update(event) { /* Envía push */ } }
class InAppObserver { update(event) { /* Guarda en DB */ } }
```

**Canales:**
- **Email:** Confirmaciones formales con comprobantes
- **SMS:** Recordatorios urgentes (2h antes)
- **Push:** Alertas en tiempo real
- **In-App:** Historial en el sistema

## ¿Quién gestiona las reservas?

**Actualmente (implementado):**

```typescript
// backend/src/controllers/ReservationController.ts
class ReservationController {
  async create(req, res) {
    const userId = req.userId; // Del JWT
    await ReservationService.createReservation(req.body);
  }
  
  async cancel(req, res) {
    const id = req.params.id;
    await ReservationService.cancelReservation(id);
  }
}

// backend/src/middleware/auth.ts
const auth = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];
  req.userId = jwt.verify(token, JWT_SECRET).id;
  next();
};
```

**Usuarios autenticados con JWT:** Crean y cancelan sus propias reservas

**Rutas actuales:**
- `POST /api/reservations` (auth) → Crear reserva
- `GET /api/reservations/user/:userId` → Ver reservas propias
- `DELETE /api/reservations/:id` → Cancelar reserva

## ¿Existirá un administrador?

**Sí, planificado para futuras versiones:**

**Jerarquía de roles futura:**

```typescript
interface User {
  id: number;
  role: 'user' | 'admin_cancha' | 'super_admin';
  cancha_id?: number; // Si es admin de cancha específica
}

// Middleware de autorización futuro
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};
```

| Rol | Permisos |
|-----|----------|
| **Usuario** | Crear/cancelar sus reservas |
| **Admin Cancha** | Gestionar su cancha específica |
| **Super Admin** | Gestión global del sistema |

## ¿Las canchas tendrán rol de administrador?

**Sí, cada cancha tendrá su admin con funcionalidades:**

**Planificado:**

```typescript
// Rutas futuras para admin de cancha
router.get('/admin/cancha/:id/reservations', authorize('admin_cancha'), ...);
router.put('/admin/cancha/:id/availability', authorize('admin_cancha'), ...);
router.put('/admin/cancha/:id/pricing', authorize('admin_cancha'), ...);
```

**Funcionalidades del Admin de Cancha:**
- Configurar disponibilidad y horarios
- Ver todas las reservas de su cancha
- Cancelar reservas con justificación
- Configurar precios de servicios
- Bloquear fechas por mantenimiento
- Generar reportes de ocupación

