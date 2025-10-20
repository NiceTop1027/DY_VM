import express from 'express';
import { 
  createUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../models/User.js';
import bcrypt from 'bcryptjs';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 관리자 권한 확인 미들웨어
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// 모든 사용자 조회 (관리자만)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    // 비밀번호 제외하고 반환
    const sanitizedUsers = users.map(({ password, ...user }) => user);
    res.json(sanitizedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 사용자 조회 (관리자만)
router.get('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...sanitizedUser } = user;
    res.json(sanitizedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 새 사용자 생성 (관리자만)
router.post('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, fullName, assignedVMs, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      id: Date.now().toString(),
      username,
      email,
      fullName: fullName || username,
      password: hashedPassword,
      assignedVMs: assignedVMs || [],
      role: role || 'student'
    };

    await createUser(user);

    const { password: _, ...sanitizedUser } = user;
    res.status(201).json(sanitizedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 사용자 정보 업데이트 (관리자만)
router.put('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, email, fullName, assignedVMs, role, password } = req.body;
    
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (fullName) updates.fullName = fullName;
    if (assignedVMs !== undefined) updates.assignedVMs = assignedVMs;
    if (role) updates.role = role;
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    await updateUser(req.params.id, updates);
    
    const updatedUser = await getUserById(req.params.id);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...sanitizedUser } = updatedUser;
    res.json(sanitizedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 사용자 삭제 (관리자만)
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // 자기 자신은 삭제 불가
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// VM 할당 (관리자만)
router.post('/users/:id/assign-vms', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { vmIds } = req.body;
    
    if (!Array.isArray(vmIds)) {
      return res.status(400).json({ error: 'vmIds must be an array' });
    }

    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await updateUser(req.params.id, { assignedVMs: vmIds });
    
    const updatedUser = await getUserById(req.params.id);
    const { password: _, ...sanitizedUser } = updatedUser;
    res.json(sanitizedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
