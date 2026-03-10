import { Server } from '../store/vpnStore';
import { serversApi } from '../api/servers';

class ServerConfigService {
  async getConfig(server: Server): Promise<string> {
    try {
      const config = await serversApi.getConfig(server.id);
      console.log('✅ Конфиг получен с сервера:', config);
      return config;
    } catch (error) {
      console.log('❌ Ошибка получения конфига:', error);
      throw error;
    }
  }
}

export default new ServerConfigService();
