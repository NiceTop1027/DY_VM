import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import proxmox from '../config/proxmox.js';

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
