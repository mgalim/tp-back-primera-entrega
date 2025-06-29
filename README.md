# Segunda Entrega - Proyecto Backend

Proyecto backend desarrollado con Node.js utilizando Express, MongoDB Atlas y el motor de plantillas Pug.

## Tecnologías

- Node.js
- Express
- MongoDB Atlas (con Mongoose)
- Pug (Motor de plantillas)
- Zod (para validación de variables de entorno)
- Passport.js (autenticación)
- bcrypt (hash de contraseñas)
- jsonwebtoken (JWT para autenticación basada en tokens)
- cookie-parser (manejo de cookies)
- dotenv (variables de entorno)

## Usuarios de prueba

- rol cliente:

  mail: user@libreria.com
  pass: admin123

- rol administrador:

  mail: admin@libreria.com
  pass: admin123

## Prerrequisitos

- Node.js (Se recomienda la última versión LTS)
- Cuenta en MongoDB Atlas
- Git

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/mgalim/tp-back-primera-entrega
   cd tu-repo
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Crear archivo de entorno `.env` en la raíz del proyecto con el siguiente contenido:
   ```
   PORT=3050
   MONGO_URL=tu_cadena_de_conexion_de_mongodb_atlas
   JWT_SECRET=tu_secreto_jwt
   SESSION_SECRET=tu_secreto_de_sesion
   ```

## Ejecución

Para ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

El servidor se iniciará en el puerto configurado (por defecto: 3050) con recarga automática habilitada.

## Estructura del Proyecto

```plaintext
.
├── src/
│   ├── api/index.js              # Punto de entrada de la aplicación
│   ├── config/             # Archivos de configuración y passport
│   ├── controllers/        # Controladores de rutas
│   ├── models/             # Modelos de base de datos
│   ├── routes/             # Rutas de la aplicación
│   ├── utils/              # Funciones de utilidad
│   ├── validations/        # Validaciones de datos
│   └── views/              # Plantillas Pug
├── .env                    # Variables de entorno
├── package.json            # Dependencias del proyecto
└── README.md               # Documentación
```

## Endpoints Disponibles

- `GET /`: Renderiza una bienvenida.
- `GET /products/catalog`: Catálogo de productos (requiere autenticación).
- `POST /sales`: Registrar una venta.
- `POST /auth/login`: Iniciar sesión.
- `POST /auth/logout`: Cerrar sesión.
- `POST /auth/register`: Registrar usuario.
- `GET /users/profile`: Perfil de usuario autenticado.

## Notas

- Recuerda configurar correctamente tu cadena de conexión de MongoDB Atlas y los secretos en el archivo `.env`.
- El sistema de descuentos se aplica automáticamente según el historial de compras del cliente.
- El stock de productos se actualiza dinámicamente tras cada venta.
- El sistema utiliza sesiones y JWT para mayor seguridad.

---

Desarrollado para la materia IFTS29 - Programación
