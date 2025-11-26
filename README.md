# UTNMetodologiaDeSistema2

## 👥 Integrantes del grupo
- Díaz Jeremías  
- Crowley Pedro  
- Meunier Juan 
- Arrue Rodrigo 
---
# Sistema de Reservas de Cancha de Fútbol ⚽

Aplicación web para gestionar reservas de canchas de fútbol con servicios adicionales.

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
## Instalación y Ejecución con Docker 🐳

### Prerrequisitos
- Docker instalado ([Descargar Docker](https://www.docker.com/get-started))
- Docker Compose instalado (incluido con Docker Desktop)

### Quick Start
```bash
# Clonar el repositorio
git clone <url-repositorio>
cd sistema-reservas-futbol

# Levantar todo el sistema
make dev

# O sin Make:
docker-compose up --build
```

### Acceso a la Aplicación

Una vez levantados los contenedores:
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/health

Verificar que todo funciona:
```bash
make urls    # Ver todas las URLs
make health  # Verificar salud de los servicios
```

### Comandos Útiles
```bash
# Desarrollo
make dev              # Levantar en modo desarrollo
make up               # Levantar en background
make down             # Detener contenedores
make logs             # Ver logs en tiempo real
make restart          # Reiniciar servicios

# Logs específicos
make logs-backend     # Solo backend
make logs-frontend    # Solo frontend

# Construcción
make build            # Construir imágenes
make rebuild          # Reconstruir todo desde cero

# Testing y calidad
make test             # Ejecutar tests
make test-coverage    # Tests con cobertura
make lint             # Linter
make format           # Formatear código

# Debugging
make shell-backend    # Shell en backend
make shell-frontend   # Shell en frontend
make status           # Estado de contenedores

# Limpieza
make clean            # Eliminar todo
make clean-volumes    # Eliminar solo volúmenes

# Producción
make prod-up          # Levantar en producción
make prod-down        # Detener producción
make prod-logs        # Logs de producción
```

### Arquitectura Docker
```
┌─────────────────────────────────────────────────┐
│         Docker Network (reservas-network)       │
│                                                 │
│  ┌────────────────┐       ┌─────────────────┐ │
│  │   Frontend     │       │    Backend      │ │
│  │   (Nginx)      │◄──────│   (Node.js)     │ │
│  │   Port: 8080   │       │   Port: 3000    │ │
│  │                │       │                 │ │
│  │  - HTML/CSS/JS │       │  - Express API  │ │
│  │  - Nginx proxy │       │  - TypeScript   │ │
│  │  - Gzip        │       │  - SQLite       │ │
│  └────────────────┘       └─────────────────┘ │
│         │                          │           │
│         └──────── /api ────────────┘           │
│                                                 │
│         ┌─────────────────┐                    │
│         │  Volume         │                    │
│         │  backend-data   │                    │
│         │  (SQLite DB)    │                    │
│         └─────────────────┘                    │
└─────────────────────────────────────────────────┘
```

### Características Docker

#### Backend
- ✅ Hot-reload activado en desarrollo
- ✅ TypeScript compilado automáticamente
- ✅ Base de datos persistente en volumen
- ✅ Health check cada 30 segundos
- ✅ Variables de entorno configurables

#### Frontend
- ✅ Nginx optimizado con Gzip
- ✅ Proxy automático a /api
- ✅ Caché de archivos estáticos
- ✅ Headers de seguridad
- ✅ Página 404 personalizada

### Solución de Problemas

#### Puerto ya en uso
```bash
# Verificar qué está usando el puerto
lsof -i :8080  # o :3000

# Cambiar puerto en docker-compose.yml
ports:
  - "8081:80"  # Usar otro puerto
```

#### Contenedor no inicia
```bash
# Ver logs detallados
make logs-backend  # o logs-frontend

# Reconstruir desde cero
make rebuild
```

#### Base de datos corrupta
```bash
# Eliminar volumen y empezar de nuevo
make clean-volumes
make dev
```

#### Cache de Docker
```bash
# Limpiar cache de Docker
docker system prune -a --volumes

# Reconstruir sin cache
make build
```

### Diferencias Desarrollo vs Producción

| Aspecto | Desarrollo | Producción |
|---------|-----------|-----------|
| Hot-reload | ✅ Sí | ❌ No |
| Source maps | ✅ Sí | ❌ No |
| Optimización | ❌ No | ✅ Sí |
| Logs | 🔊 Verbose | 🔇 Minimal |
| Restart | unless-stopped | always |
| Build | Incremental | Completo |

### Monitoreo
```bash
# Ver recursos usados
docker stats

# Ver estado de salud
make health

# Inspeccionar contenedor
docker inspect reservas-backend
docker inspect reservas-frontend
```
