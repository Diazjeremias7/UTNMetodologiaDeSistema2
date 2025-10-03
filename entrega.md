Entrega Parcial – Metodología de Sistemas II
Temática elegida

Sistema de reservas para cancha de fútbol.
La aplicación permitirá a los usuarios:
Ver la disponibilidad de turnos.
Reservar una cancha.
Agregar servicios adicionales como iluminación, árbitro o pelotas.
Cancelar reservas en caso necesario.

El objetivo es empezar con una solución simple que se pueda ampliar más adelante.
Patrones que se podrían aplicar (resumido)
Singleton: para manejar la conexión a la base de datos de manera centralizada.
Decorator: para los servicios extra de la reserva (luz, pelotas, árbitro).
(Más adelante, si hace falta) Observer para notificaciones.

Primeros avances y decisiones
Se definieron los módulos principales:
Usuarios
Reservas
Servicios adicionales
La reserva básica será la clase principal.
Los extras (luz, árbitro, pelotas) se agregarán como extensiones con Decorator.
Se va a usar Singleton para que la conexión a la base de datos sea única y compartida.
