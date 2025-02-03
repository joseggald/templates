# Configuraciones e inicialización de proyecto

### Instalación de dependencias:

- npm i
- bun i

### Set de variables de entorno

- **Windows:**

  - `$env:DEBUG="false";`
    - En este caso se utilizara por si quires debuguear errores o logs (true para activar y false para desactivar).
  - `$env:NODE_ENV="development";`
    - Se utilizara para designar el ambiente dev que se trabajara.
- **Mac & Linux:**

  - export DEBUG="false"
    - En este caso se utilizara por si quires debuguear errores o logs (true para activar y false para desactivar).
  - export NODE_ENV="development"
    - Se utilizara para designar el ambiente dev que se trabajara.

### Inicializando servidor

```bash
#NPM
npm run dev

#BUN
bun dev
```

Si quieres utilizar solo para levantar el proyecto las variables puedes hacerlo así:

### NPM

```bash
//Windows
$env:DEBUG="false"; $env:NODE_ENV="development"; npm run dev
//Mac & Linux
DEBUG="false" NODE_ENV="development" npm run dev
```

### BUN

```bash
//Windows
$env:DEBUG="false"; $env:NODE_ENV="development"; bun dev
//Mac & Linux
DEBUG="false" NODE_ENV="development" bun dev
```

### Compilación de proyecto

Para saber que todo funcionara se recomienda compilar el proyecto con docker para esto en la carpeta raiz en donde se encuentra el docker file será de la siguiente manera:

```bash
# Se construye la imagen y compila el proyecto
docker build -t be .

# Se levanta la imagen en un contenedor y se prueba que funcione
docker run --env-file .env -p 3000:3000 be
```
