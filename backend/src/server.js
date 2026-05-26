import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS || '').split(','),
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]
  .filter(Boolean)
  .map((origin) => origin.trim().replace(/\/$/, ''));

app.use(cors({
  origin(origin, callback) {

    // Permitir requests sin origin (Postman, mobile apps, etc)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Manejar preflight OPTIONS
app.options('*', cors());

app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 4000;

// Conectar DB e iniciar servidor
connectDB()
  .then(() => {
    console.log('MongoDB conectado');

    app.listen(PORT, () => {
      console.log(`API en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('No se pudo iniciar la API:', error);
    process.exit(1);
  });