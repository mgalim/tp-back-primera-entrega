import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import serverless from 'serverless-http';
import { fileURLToPath } from 'url';
import { env } from '../src/config/env.js';
import { connectDB } from '../src/config/mongo.config.js';
import passport from '../src/config/passport.js';
import route from '../src/routes/routes.js';
import { initializeDatabase } from '../src/utils/init.js';

// Establecer conexión a la base de datos de MongoDb y cargar datos iniciales
await connectDB(env.MONGO_URL);
await initializeDatabase();
const app = express();

// Configurar Pug como motor de plantillas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// Middleware para manejar cookies
app.use(cookieParser());
// Middlewares para manejar datos JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Inicializar Passport
app.use(passport.initialize());

// Setear las rutas
app.use('/', route);

export const handler = serverless(app);


// // Iniciar el servidor
// app.listen(env.PORT, () => {
//   console.log(`Server is running on http://localhost:${env.PORT}`);
// });
