import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { initializePredefinedAccounts } from './models/User.js';
import authRoutes from './routes/auth.js';
import vmRoutes from './routes/vm.js';
import proxmoxRoutes from './routes/proxmox.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
const envPath = path.join(__dirname, '../.env');
console.log(`Loading .env from: ${envPath}`);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('✅ .env file loaded successfully');
  console.log(`PROXMOX_MOCK=${process.env.PROXMOX_MOCK}`);
  console.log(`PROXMOX_HOST=${process.env.PROXMOX_HOST}`);
  console.log(`ADMIN_EMAIL=${process.env.ADMIN_EMAIL}`);
}

// 환경 변수 로드 후 초기 계정 생성
initializePredefinedAccounts(bcrypt).catch(console.error);

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

// Serve static files from client/dist in production
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// API info route
app.get('/api', (req, res) => {
  res.json({
    name: 'Proxmox VM Platform API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      vm: '/api/vm/*',
      proxmox: '/api/proxmox/*',
      admin: '/api/admin/* (admin only)'
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vm', vmRoutes);
app.use('/api/proxmox', proxmoxRoutes);
app.use('/api/admin', adminRoutes);

// Serve React app for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Proxmox Host: ${process.env.PROXMOX_HOST}`);
});
