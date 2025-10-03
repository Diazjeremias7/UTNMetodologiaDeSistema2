# Entrega Parcial – Metodología de Sistemas II

## Temática elegida
**Sistema de reservas para cancha de fútbol**

La aplicación permitirá a los usuarios:  
- Ver la disponibilidad de turnos  
- Reservar una cancha  
- Agregar servicios adicionales (iluminación, árbitro, pelotas)  
- Cancelar reservas en caso necesario  

El objetivo es comenzar con una solución **simple**, pero diseñada de manera que pueda ampliarse en futuras etapas.

---

## Patrones de diseño propuestos
- **Singleton**: para manejar la conexión a la base de datos de forma centralizada  
- **Decorator**: para implementar los servicios adicionales en las reservas (luz, árbitro, pelotas)  
- *(Opcional, a futuro)* **Observer**: para notificaciones a los usuarios  

---

## Primeros avances y decisiones
- Se definieron los **módulos principales**:  
  - **Usuarios**  
  - **Reservas**  
  - **Servicios adicionales**  
- La **reserva básica** será la clase principal  
- Los **extras** se incorporarán mediante el patrón **Decorator**  
- Se utilizará **Singleton** para que la conexión a la base de datos sea única y compartida  
