# Imagen base de Node.js
FROM node:20-alpine

# Información del maintainer
LABEL maintainer="tu-equipo@ejemplo.com"
LABEL description="Backend para sistema de reservas de canchas de fútbol"

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]