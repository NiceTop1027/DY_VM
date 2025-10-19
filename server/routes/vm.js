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
    const allVMs = await proxmox.getVMs(node);
    
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
    
    res.json(filteredVMs);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
