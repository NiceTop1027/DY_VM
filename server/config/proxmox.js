import axios from 'axios';
import https from 'https';

class ProxmoxAPI {
  constructor() {
    this.host = process.env.PROXMOX_HOST;
    this.port = process.env.PROXMOX_PORT || 8006;
    this.baseURL = `https://${this.host}:${this.port}/api2/json`;
    this.ticket = null;
    this.csrfToken = null;
    
    // Ignore self-signed certificates (for development)
    this.httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });
  }

  async authenticate() {
    try {
      const response = await axios.post(
        `${this.baseURL}/access/ticket`,
        {
          username: process.env.PROXMOX_USER,
          password: process.env.PROXMOX_PASSWORD
        },
        { httpsAgent: this.httpsAgent }
      );

      this.ticket = response.data.data.ticket;
      this.csrfToken = response.data.data.CSRFPreventionToken;
      
      return true;
    } catch (error) {
      console.error('Proxmox authentication failed:', error.message);
      return false;
    }
  }

  async request(method, endpoint, data = null) {
    if (!this.ticket) {
      await this.authenticate();
    }

    try {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: {
          Cookie: `PVEAuthCookie=${this.ticket}`,
          CSRFPreventionToken: this.csrfToken
        },
        httpsAgent: this.httpsAgent
      };

      if (data) {
        if (method === 'GET') {
          config.params = data;
        } else {
          config.data = data;
        }
      }

      const response = await axios(config);
      return response.data.data;
    } catch (error) {
      // Token expired, re-authenticate
      if (error.response?.status === 401) {
        await this.authenticate();
        return this.request(method, endpoint, data);
      }
      throw error;
    }
  }

  // VM Management Methods
  async getVMs(node = process.env.PROXMOX_NODE) {
    return await this.request('GET', `/nodes/${node}/qemu`);
  }

  async getVM(node, vmid) {
    return await this.request('GET', `/nodes/${node}/qemu/${vmid}/status/current`);
  }

  async createVM(node, vmConfig) {
    return await this.request('POST', `/nodes/${node}/qemu`, vmConfig);
  }

  async startVM(node, vmid) {
    return await this.request('POST', `/nodes/${node}/qemu/${vmid}/status/start`);
  }

  async stopVM(node, vmid) {
    return await this.request('POST', `/nodes/${node}/qemu/${vmid}/status/stop`);
  }

  async shutdownVM(node, vmid) {
    return await this.request('POST', `/nodes/${node}/qemu/${vmid}/status/shutdown`);
  }

  async deleteVM(node, vmid) {
    return await this.request('DELETE', `/nodes/${node}/qemu/${vmid}`);
  }

  async getVNCWebSocket(node, vmid) {
    const vncData = await this.request('POST', `/nodes/${node}/qemu/${vmid}/vncproxy`, {
      websocket: 1
    });
    
    return {
      port: vncData.port,
      ticket: vncData.ticket,
      upid: vncData.upid,
      user: vncData.user,
      cert: vncData.cert
    };
  }

  async getNodeResources(node = process.env.PROXMOX_NODE) {
    return await this.request('GET', `/nodes/${node}/status`);
  }

  async getStorages(node = process.env.PROXMOX_NODE) {
    return await this.request('GET', `/nodes/${node}/storage`);
  }

  async getNextVMID() {
    return await this.request('GET', '/cluster/nextid');
  }
}

export default new ProxmoxAPI();
