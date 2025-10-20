import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import proxmox from '../config/proxmox.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all VMs (filtered by user's assigned VMs)
router.get('/', async (req, res) => {
  try {
    const node = process.env.PROXMOX_NODE;
    
    // Proxmox 연결 확인
    if (!process.env.PROXMOX_HOST || !process.env.PROXMOX_USER || !process.env.PROXMOX_PASSWORD) {
      console.error('Proxmox credentials not configured');
      return res.status(500).json({ 
        error: 'Proxmox server not configured',
        details: 'Please configure PROXMOX_HOST, PROXMOX_USER, and PROXMOX_PASSWORD environment variables'
      });
    }
    
    console.log(`Fetching VMs from Proxmox node: ${node}`);
    const allVMs = await proxmox.getVMs(node);
    console.log(`Retrieved ${allVMs?.length || 0} VMs from Proxmox`);
    
    // 미들웨어에서 설정된 사용자 정보 사용
    const userAssignedVMs = req.user.assignedVMs || [];
    const userRole = req.user.role || 'student';
    
    // 관리자는 모든 VM, 일반 사용자는 할당된 VM만
    let filteredVMs;
    if (userRole === 'admin') {
      filteredVMs = allVMs;
    } else {
      filteredVMs = allVMs.filter(vm => userAssignedVMs.includes(vm.vmid));
    }
    
    console.log(`Returning ${filteredVMs?.length || 0} VMs for user ${req.user.email} (role: ${userRole})`);
    res.json(filteredVMs);
  } catch (error) {
    console.error('Error fetching VMs:', error.message);
    console.error('Error details:', error.response?.data || error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data?.errors || 'Failed to connect to Proxmox server'
    });
  }
});

// Get specific VM
router.get('/:vmid', async (req, res) => {
  try {
    const node = process.env.PROXMOX_NODE;
    const { vmid } = req.params;
    const vm = await proxmox.getVM(node, vmid);
    res.json(vm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start VM
router.post('/:vmid/start', async (req, res) => {
  try {
    const node = process.env.PROXMOX_NODE;
    const { vmid } = req.params;
    const result = await proxmox.startVM(node, vmid);
    res.json({ message: 'VM started', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop VM
router.post('/:vmid/stop', async (req, res) => {
  try {
    const node = process.env.PROXMOX_NODE;
    const { vmid } = req.params;
    const result = await proxmox.stopVM(node, vmid);
    res.json({ message: 'VM stopped', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Shutdown VM
router.post('/:vmid/shutdown', async (req, res) => {
  try {
    const node = process.env.PROXMOX_NODE;
    const { vmid } = req.params;
    const result = await proxmox.shutdownVM(node, vmid);
    res.json({ message: 'VM shutdown initiated', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get VNC console info
router.get('/:vmid/vnc', async (req, res) => {
  try {
    const node = process.env.PROXMOX_NODE;
    const { vmid } = req.params;
    const vncInfo = await proxmox.getVNCWebSocket(node, vmid);
    
    res.json({
      ...vncInfo,
      host: process.env.PROXMOX_HOST,
      vmid
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
