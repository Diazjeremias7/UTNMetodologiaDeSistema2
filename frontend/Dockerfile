# Imagen base de nginx
FROM nginx:alpine

# Información del maintainer
LABEL maintainer="tu-equipo@ejemplo.com"
LABEL description="Frontend para sistema de reservas de canchas de fútbol"

# Copiar archivos del frontend al directorio de nginx
COPY . /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Nginx se inicia automáticamente con la imagen base
CMD ["nginx", "-g", "daemon off;"]