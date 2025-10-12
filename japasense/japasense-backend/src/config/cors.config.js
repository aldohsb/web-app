import { config } from './environment.js';

export const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      config.corsOrigin,
      'http://localhost:5173',
      'http://localhost:3000',
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
};

export default corsOptions;