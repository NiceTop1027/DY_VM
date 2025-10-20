// Mock Proxmox API for development/demo without real Proxmox server
class ProxmoxMockAPI {
  constructor() {
    console.log('⚠️  Using Mock Proxmox API (no real Proxmox connection)');
  }

  async authenticate() {
    console.log('✅ Mock Proxmox authentication successful');
    return true;
  }

  async getVMs(node = 'pve') {
    console.log(`Mock: Fetching VMs from node: ${node}`);
    return [
      {
        vmid: 100,
        name: 'Ubuntu-Server-01',
        status: 'running',
        maxmem: 4294967296, // 4GB
        mem: 2147483648, // 2GB used
        maxdisk: 34359738368, // 32GB
        disk: 10737418240, // 10GB used
        cpus: 2,
        cpu: 0.25,
        uptime: 86400
      },
      {
        vmid: 101,
        name: 'Ubuntu-Server-02',
        status: 'stopped',
        maxmem: 2147483648, // 2GB
        mem: 0,
        maxdisk: 21474836480, // 20GB
        disk: 5368709120, // 5GB used
        cpus: 1,
        cpu: 0
      },
      {
        vmid: 102,
        name: 'Windows-Server-01',
        status: 'running',
        maxmem: 8589934592, // 8GB
        mem: 6442450944, // 6GB used
        maxdisk: 107374182400, // 100GB
        disk: 53687091200, // 50GB used
        cpus: 4,
        cpu: 0.45,
        uptime: 172800
      }
    ];
  }

  async getVM(node, vmid) {
    console.log(`Mock: Fetching VM ${vmid} from node: ${node}`);
    const vms = await this.getVMs(node);
    return vms.find(vm => vm.vmid === parseInt(vmid)) || null;
  }

  async startVM(node, vmid) {
    console.log(`Mock: Starting VM ${vmid} on node: ${node}`);
    return { status: 'success', message: 'VM start initiated' };
  }

  async stopVM(node, vmid) {
    console.log(`Mock: Stopping VM ${vmid} on node: ${node}`);
    return { status: 'success', message: 'VM stop initiated' };
  }

  async shutdownVM(node, vmid) {
    console.log(`Mock: Shutting down VM ${vmid} on node: ${node}`);
    return { status: 'success', message: 'VM shutdown initiated' };
  }

  async getVNCWebSocket(node, vmid) {
    console.log(`Mock: Getting VNC info for VM ${vmid} on node: ${node}`);
    return {
      port: 5900,
      ticket: 'mock-vnc-ticket-' + Date.now(),
      upid: 'mock-upid',
      user: 'root@pam',
      cert: 'mock-cert'
    };
  }

  async getNodeResources(node = 'pve') {
    console.log(`Mock: Fetching resources for node: ${node}`);
    return {
      cpu: 0.35,
      maxcpu: 8,
      mem: 8589934592, // 8GB used
      maxmem: 17179869184, // 16GB total
      disk: 107374182400, // 100GB used
      maxdisk: 536870912000, // 500GB total
      uptime: 259200
    };
  }

  async getStorages(node = 'pve') {
    console.log(`Mock: Fetching storages for node: ${node}`);
    return [
      {
        storage: 'local',
        type: 'dir',
        content: 'vztmpl,iso,backup',
        active: 1,
        avail: 429496729600, // 400GB
        total: 536870912000, // 500GB
        used: 107374182400 // 100GB
      }
    ];
  }
}

export default new ProxmoxMockAPI();
