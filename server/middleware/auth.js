import jwt from 'jsonwebtoken';
import { getUserById } from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 전체 사용자 정보 가져오기 (assignedVMs, role 포함)
    const fullUser = await getUserById(decoded.id);
    
    if (!fullUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // req.user에 전체 사용자 정보 저장
    req.user = {
      id: fullUser.id,
      email: fullUser.email,
      username: fullUser.username,
      assignedVMs: fullUser.assignedVMs || [],
      role: fullUser.role || 'student'
    };
    
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
