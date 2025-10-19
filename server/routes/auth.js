import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { users } from '../utils/users.js';

const router = express.Router();

// 관리자가 미리 생성한 계정 (예시)
// 실제로는 관리자 페이지에서 생성하거나 데이터베이스에서 관리
const predefinedAccounts = [
  {
    username: 'student1',
    email: 'student1@school.com',
    password: 'password123', // 실제로는 해시된 비밀번호
    fullName: '학생1',
    assignedVMs: [100, 101], // 할당된 VM ID 목록
    role: 'student'
  },
  {
    username: 'student2',
    email: 'student2@school.com',
    password: 'password123',
    fullName: '학생2',
    assignedVMs: [102],
    role: 'student'
  },
  {
    username: 'admin',
    email: 'admin@school.com',
    password: 'admin123',
    fullName: '관리자',
    assignedVMs: [], // 관리자는 모든 VM 접근 가능
    role: 'admin'
  }
];

// 초기화: 미리 정의된 계정을 users Map에 추가
async function initializePredefinedAccounts() {
  const bcrypt = await import('bcryptjs');
  for (const account of predefinedAccounts) {
    const hashedPassword = await bcrypt.default.hash(account.password, 10);
    users.set(account.email, {
      id: Date.now().toString() + Math.random(),
      username: account.username,
      email: account.email,
      fullName: account.fullName,
      password: hashedPassword,
      assignedVMs: account.assignedVMs,
      role: account.role,
      createdAt: new Date().toISOString()
    });
  }
}

// 서버 시작 시 계정 초기화
initializePredefinedAccounts();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      id: Date.now().toString(),
      username,
      email,
      fullName,
      password: hashedPassword,
      vms: [],
      createdAt: new Date().toISOString()
    };

    users.set(email, user);

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        assignedVMs: user.assignedVMs || [],
        role: user.role || 'student'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        assignedVMs: user.assignedVMs || [],
        role: user.role || 'student'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify token
router.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = Array.from(users.values()).find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        assignedVMs: user.assignedVMs || [],
        role: user.role || 'student'
      }
    });
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
});

export default router;
