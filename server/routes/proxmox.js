import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import proxmoxReal from '../config/proxmox.js';
import proxmoxMock from '../config/proxmox-mock.js';

// Use mock Proxmox if PROXMOX_MOCK=true
const proxmox = process.env.PROXMOX_MOCK === 'true' ? proxmoxMock : proxmoxReal;

const router = express.Router();

router.use(authenticateToken);

// Get node resources
router.get('/resources', async (req, res) => {
  try {
    const node = process.env.PROXMOX_NODE;
    const resources = await proxmox.getNodeResources(node);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available storages
router.get('/storages', async (req, res) => {
  try {
    const node = process.env.PROXMOX_NODE;
    const storages = await proxmox.getStorages(node);
    res.json(storages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
