import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { VpnModule } = NativeModules;
const vpnEmitter = new NativeEventEmitter(VpnModule);

export type VpnStatus = 'connected' | 'disconnecting' | 'disconnected' | 'connecting' | 'error';

class VpnService {
  private statusListener: any = null;

  // Запросить разрешение на VPN
  async prepare(): Promise<string> {
    if (Platform.OS === 'android') {
      return await VpnModule.prepare();
    }
    return 'granted';
  }

  // Подключиться к VPN
  async connect(serverConfig: string): Promise<string> {
    try {
      const permission = await this.prepare();
      if (permission === 'granted' || permission === 'requested') {
        return await VpnModule.connect(serverConfig);
      }
      throw new Error('VPN permission denied');
    } catch (error) {
      throw error;
    }
  }

  // Отключиться от VPN
  async disconnect(): Promise<string> {
    return await VpnModule.disconnect();
  }

  // Получить текущий статус
  async getStatus(): Promise<VpnStatus> {
    return await VpnModule.getStatus();
  }

  // Подписаться на изменения статуса
  onStatusChange(callback: (status: VpnStatus) => void) {
    this.statusListener = vpnEmitter.addListener('vpnStatusChanged', callback);
    return this.statusListener;
  }

  // Отписаться от изменений статуса
  removeStatusListener() {
    if (this.statusListener) {
      this.statusListener.remove();
      this.statusListener = null;
    }
  }
}

export default new VpnService();
