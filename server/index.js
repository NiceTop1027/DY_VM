import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import vmRoutes from './routes/vm.js';
import proxmoxRoutes from './routes/proxmox.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 설정 - 모든 도메인 허용 (개발용)
app.use(cors({
  origin: true, // 모든 origin 허용
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-JSON'],
  maxAge: 86400 // 24시간
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Proxmox VM Platform API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      vm: '/api/vm/*',
      proxmox: '/api/proxmox/*'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    proxmox: {
      host: process.env.PROXMOX_HOST,
      port: process.env.PROXMOX_PORT,
      node: process.env.PROXMOX_NODE
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vm', vmRoutes);
app.use('/api/proxmox', proxmoxRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Proxmox Host: ${process.env.PROXMOX_HOST}`);
});
