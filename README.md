# Primer Entrega - Proyecto Backend

Proyecto backend desarrollado con Node.js utilizando Express, MongoDB y el motor de plantillas Pug.

## Tecnologías

- Node.js
- Express
- MongoDB con Mongoose
- Pug (Motor de plantillas)
- Docker (para contenedor MongoDB)
- Zod (para validación de variables de entorno)

## Prerrequisitos

- Node.js (Se recomienda la última versión LTS)
- Docker y Docker Compose
- Git

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
```

3. Crear archivo de entorno:
   - `.env`

## Variables de Entorno en .env

- `PORT`: Puerto del servidor (por defecto: 3050)
- `MONGO_URL`: Cadena de conexión de MongoDB

## Ejecutar MongoDB

El proyecto utiliza MongoDB en un contenedor Docker. Para iniciar la base de datos:

```bash
docker-compose up -d
```

## Desarrollo

Para ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

El servidor se iniciará en el puerto configurado (por defecto: 3050) con recarga automática habilitada.

## Estructura del Proyecto

```plaintext
.
├── src/
│   ├── app.js              # Punto de entrada de la aplicación
│   ├── config/             # Archivos de configuración
│   ├── controllers/      	# Controladores de rutas
│   ├── models/           	# Modelos de base de datos
│   ├── routes/             # Rutas de la aplicación
│   ├── services/          	# Lógica de negocio
│   ├── utils/              # Funciones de utilidad
│   ├── validations/     	# Funciones de utilidad
│   └── views/              # Plantillas Pug
├── .env                    # Variables de entorno
├── docker-compose.yml 	    # Configuración de Docker
└── package.json       		# Dependencias del proyecto
```

## Endpoints Disponibles

- `GET /`: Renderiza una bienvenida.
