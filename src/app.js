import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { connectDB } from './config/mongo.config.js';
import route from './routes/routes.js';
import { initializeDatabase } from './utils/init.js';
import passport from './config/passport.js';
import cookieParser from 'cookie-parser';

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

// Iniciar el servidor
app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
