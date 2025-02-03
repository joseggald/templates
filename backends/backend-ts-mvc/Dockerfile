FROM node:18-alpine as builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package.json ./

# Instalar solo dependencias de producción
RUN npm install --omit=dev

# Copiar los archivos compilados
COPY --from=builder /app/dist ./dist

COPY .env .env

# Variables de entorno
ENV NODE_ENV=production \
    PORT=3000

# Exponer puerto
EXPOSE $PORT

# Comando para ejecutar la aplicación
CMD ["node", "dist/index.js"]
