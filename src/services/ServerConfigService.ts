import { Server } from '../store/vpnStore';

// Временные тестовые конфиги (позже будут приходить с сервера)
const TEST_CONFIGS: Record<string, string> = {
  '1': `[Interface]
PrivateKey = PLACEHOLDER_PRIVATE_KEY
Address = 10.0.0.2/24
DNS = 1.1.1.1

[Peer]
PublicKey = PLACEHOLDER_PUBLIC_KEY
Endpoint = de.selfvpn.com:51820
AllowedIPs = 0.0.0.0/0`,

  '2': `[Interface]
PrivateKey = PLACEHOLDER_PRIVATE_KEY
Address = 10.0.0.2/24
DNS = 1.1.1.1

[Peer]
PublicKey = PLACEHOLDER_PUBLIC_KEY
Endpoint = nl.selfvpn.com:51820
AllowedIPs = 0.0.0.0/0`,

  '3': `[Interface]
PrivateKey = PLACEHOLDER_PRIVATE_KEY
Address = 10.0.0.2/24
DNS = 1.1.1.1

[Peer]
PublicKey = PLACEHOLDER_PUBLIC_KEY
Endpoint = fi.selfvpn.com:51820
AllowedIPs = 0.0.0.0/0`,
};

class ServerConfigService {
  // Получить конфиг для сервера
  getConfig(server: Server): string {
    return TEST_CONFIGS[server.id] || TEST_CONFIGS['1'];
  }
}

export default new ServerConfigService();
