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
## Instalación y Ejecución con Docker

### Prerrequisitos
- Docker instalado ([Descargar Docker](https://www.docker.com/get-started))
- Docker Compose instalado (incluido con Docker Desktop)

### Desarrollo

#### Opción 1: Usando Make (recomendado)
```bash
# Ver todos los comandos disponibles
make help

# Levantar el proyecto en modo desarrollo
make dev

# Ver logs
make logs

# Detener el proyecto
make down
```

#### Opción 2: Usando Docker Compose directamente
```bash
# Levantar el proyecto
docker-compose up --build

# Levantar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Acceso a la Aplicación

Una vez levantados los contenedores:
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

### Comandos Útiles
```bash
# Ver estado de los contenedores
make status

# Reiniciar servicios
make restart

# Ejecutar tests
make test

# Ver logs solo del backend
make logs-backend

# Abrir shell en el backend
make shell-backend

# Limpiar todo (contenedores, volúmenes, imágenes)
make clean
```

### Producción
```bash
# Levantar en modo producción
make prod-up

# Ver logs de producción
make prod-logs

# Detener producción
make prod-down
```

### Solución de Problemas

#### El backend no inicia
```bash
# Ver logs detallados
make logs-backend

# Reconstruir sin cache
make build
make dev
```

#### Puerto 3000 o 8080 ya en uso
```bash
# Opción 1: Detener el servicio que usa el puerto
# Opción 2: Cambiar el puerto en docker-compose.yml
# Por ejemplo: "3001:3000" en lugar de "3000:3000"
```

#### Limpiar todo y empezar de nuevo
```bash
make clean
make dev
```

## Instalación Manual (sin Docker)

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
Abrir `frontend/index.html` en el navegador o usar un servidor local:
```bash
# Con Python
cd frontend
python -m http.server 8080

# Con Node.js (http-server)
npx http-server frontend -p 8080
```
