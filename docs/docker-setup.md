# Configuración de Docker - Guía Detallada

## Arquitectura del Sistema
```
┌─────────────────────────────────────────────────┐
│              Docker Network                     │
│           (reservas-network)                    │
│                                                 │
│  ┌──────────────┐         ┌──────────────┐    │
│  │   Frontend   │         │   Backend    │    │
│  │   (Nginx)    │ ─────▶  │  (Node.js)   │    │
│  │   :8080      │         │    :3000     │    │
│  └──────────────┘         └──────────────┘    │
│         │                         │            │
│         │                         │            │
│         │                    ┌────▼────┐       │
│         │                    │ SQLite  │       │
│         │                    │   DB    │       │
│         │                    └─────────┘       │
└─────────────────────────────────────────────────┘
```

## Estructura de Archivos Docker
```
proyecto/
├── backend/
│   ├── Dockerfile           # Imagen para producción
│   ├── Dockerfile.dev       # Imagen para desarrollo
│   └── .dockerignore        # Archivos a ignorar
├── docker-compose.yml       # Configuración desarrollo
├── docker-compose.prod.yml  # Configuración producción
├── nginx.conf               # Configuración de nginx
└── Makefile                 # Comandos automatizados
```

## Servicios

### Backend (Node.js + TypeScript)
- **Puerto:** 3000
- **Hot-reload:** Activado en desarrollo
- **Volúmenes:** Código mapeado para desarrollo
- **Health check:** Endpoint `/health`

### Frontend (Nginx)
- **Puerto:** 8080
- **Proxy:** Redirige `/api` al backend
- **Compresión:** Gzip habilitado
- **Caché:** Configurado para assets estáticos

## Variables de Entorno

### Backend
```env
NODE_ENV=development
PORT=3000
DB_PATH=/app/data/database.sqlite
JWT_SECRET=cambiar_en_produccion
```

## Volúmenes

### Desarrollo
- `./backend:/app` - Código fuente (hot-reload)
- `/app/node_modules` - Dependencias (no sobrescribir)

### Producción
- `db-data:/app/data` - Persistencia de base de datos

## Redes

- **reservas-network:** Red bridge personalizada
  - Permite comunicación entre contenedores
  - Aislamiento del host

## Healthchecks

### Backend
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Flujo de Desarrollo

### 1. Primera vez
```bash
make install  # Instalar dependencias
make dev      # Levantar contenedores
```

### 2. Desarrollo diario
```bash
make up       # Levantar en background
make logs     # Ver logs
make down     # Detener al finalizar
```

### 3. Testing
```bash
make test              # Ejecutar tests
make test-coverage     # Con cobertura
```

### 4. Limpieza
```bash
make clean    # Eliminar todo y empezar de cero
```

## Diferencias: Desarrollo vs Producción

| Característica | Desarrollo | Producción |
|----------------|------------|------------|
| Hot-reload | ✅ Sí | ❌ No |
| Source maps | ✅ Sí | ❌ No |
| Logs verbosos | ✅ Sí | ⚠️ Limitados |
| Build optimizado | ❌ No | ✅ Sí |
| Volúmenes | Código mapeado | Solo datos |
| Restart policy | unless-stopped | always |

## Troubleshooting

### Error: Puerto ya en uso
```bash
# Ver qué está usando el puerto
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar 3001 en el host
```

### Error: Cannot connect to Docker daemon
```bash
# Verificar que Docker está corriendo
docker ps

# Reiniciar Docker Desktop
```

### Error: Build falla
```bash
# Limpiar cache y reconstruir
docker-compose build --no-cache
```

### Contenedor se reinicia constantemente
```bash
# Ver logs para diagnóstico
docker-compose logs backend

# Verificar health check
docker inspect reservas-backend | grep -A 10 Health
```

## Optimizaciones

### Multi-stage builds (futuro)
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

### Docker Compose override
Para configuraciones personales sin modificar el archivo principal:
```yaml
# docker-compose.override.yml (git-ignored)
version: '3.8'
services:
  backend:
    ports:
      - "3001:3000"
    environment:
      - DEBUG=true
```

## Buenas Prácticas

1. **Usar .dockerignore** - Reducir tamaño de build
2. **Healthchecks** - Monitorear estado de contenedores
3. **Logs centralizados** - Usar `docker-compose logs`
4. **Volúmenes nombrados** - Para datos persistentes
5. **Redes personalizadas** - Mejor que links deprecados
6. **Multi-stage builds** - Imágenes más pequeñas
7. **No correr como root** - Crear usuario en Dockerfile

## Referencias

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)