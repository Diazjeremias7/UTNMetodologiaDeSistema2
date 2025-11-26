# UTNMetodologiaDeSistema2

## 👥 Integrantes del grupo
- Díaz Jeremías  
- Crowley Pedro  
- Meunier Juan 
- Arrue Rodrigo 
---
# Sistema de Reservas de Cancha de Fútbol ⚽

Aplicación web para gestionar reservas de canchas de fútbol con servicios adicionales.

## Integrantes
- [Nombre 1]
- [Nombre 2]
- [Nombre 3]
- [Nombre 4]

## Tecnologías
- **Backend:** Node.js + TypeScript + Express
- **Frontend:** HTML + CSS + JavaScript
- **Base de datos:** SQLite

## Patrones de Diseño Implementados
- **Singleton:** Conexión a base de datos
- **Decorator:** Servicios adicionales en reservas

## Instalación

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
Abrir `frontend/index.html` en el navegador

## Estructura del Proyecto
```
├── backend/
│   ├── src/
│   │   ├── config/      # Configuraciones
│   │   ├── models/      # Modelos de datos
│   │   ├── services/    # Lógica de negocio
│   │   ├── controllers/ # Controladores
│   │   ├── routes/      # Rutas de API
│   │   └── decorators/  # Patrón Decorator
│   └── tests/           # Pruebas
└── frontend/
    ├── css/             # Estilos
    ├── js/              # Scripts
    └── pages/           # Páginas HTML
```

## API Endpoints

### Usuarios
- `POST /api/users/register` - Registrar usuario
- `POST /api/users/login` - Iniciar sesión

### Reservas
- `GET /api/reservations` - Listar reservas
- `POST /api/reservations` - Crear reserva
- `DELETE /api/reservations/:id` - Cancelar reserva

### Disponibilidad
- `GET /api/availability?date=YYYY-MM-DD` - Ver disponibilidad

## Licencia
MIT
