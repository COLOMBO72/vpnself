import React from 'react';
import VpnService from '../services/VpnService';
import { useEffect } from 'react';
import ServerConfigService from '../services/ServerConfigService';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useVpnStore } from '../store/vpnStore';
import BannerAdComponent from '../components/BannerAdComponent';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { status, setStatus, selectedServer, plan } = useVpnStore();

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  const handleConnect = async () => {
    if (isConnected) {
      setStatus('disconnecting');
      await VpnService.disconnect();
      setStatus('disconnected');
    } else {
      if (!selectedServer) {
        Alert.alert('Сервер не выбран', 'Пожалуйста выбери сервер для подключения');
        return;
      }
      setStatus('connecting');
      try {
        const config = ServerConfigService.getConfig(selectedServer);
        await VpnService.connect(config);
      } catch (error) {
        setStatus('disconnected');
        Alert.alert('Ошибка', 'Не удалось подключиться к VPN');
      }
    }
  };

  useEffect(() => {
    const listener = VpnService.onStatusChange((status) => {
      setStatus(status);
    });
    return () => VpnService.removeStatusListener();
  }, []);
  const statusColor = isConnected ? '#00ff88' : isConnecting ? '#ffaa00' : '#ff4466';

  const statusText = isConnected
    ? 'Подключено'
    : isConnecting
    ? 'Подключение...'
    : status === 'disconnecting'
    ? 'Отключение...'
    : 'Отключено';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1a" />

      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>SELFVPN</Text>
        <TouchableOpacity
          style={styles.planBadge}
          onPress={() => navigation.navigate('Subscription')}
        >
          <Text style={styles.planText}>{plan === 'free' ? '🔓 Free' : '💎 Premium'}</Text>
        </TouchableOpacity>
      </View>

      {/* Статус */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
      </View>

      {/* Кнопка подключения */}
      <TouchableOpacity
        style={[
          styles.connectButton,
          isConnected && styles.connectButtonActive,
          isConnecting && styles.connectButtonConnecting,
        ]}
        onPress={handleConnect}
        disabled={isConnecting}
      >
        <Text style={styles.connectButtonText}>
          {isConnected ? '⏹ Отключить' : isConnecting ? '⏳ Подключение' : '▶ Подключить'}
        </Text>
      </TouchableOpacity>

      {/* Выбранный сервер */}
      <TouchableOpacity style={styles.serverButton} onPress={() => navigation.navigate('Servers')}>
        <Text style={styles.serverButtonText}>
          {selectedServer ? `${selectedServer.flag} ${selectedServer.name}` : '🌍 Выбрать сервер'}
        </Text>
        <Text style={styles.serverArrow}>›</Text>
      </TouchableOpacity>

      {/* Реклама для Free пользователей */}
      {plan === 'free' && (
        <View style={styles.adContainer}>
          <BannerAdComponent />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  planBadge: {
    backgroundColor: '#1e1e32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3333ff',
  },
  planText: {
    color: '#aaaaff',
    fontSize: 13,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  connectButton: {
    backgroundColor: '#1e1e32',
    borderWidth: 2,
    borderColor: '#3333ff',
    borderRadius: 100,
    paddingVertical: 22,
    alignItems: 'center',
    marginBottom: 32,
  },
  connectButtonActive: {
    backgroundColor: '#003322',
    borderColor: '#00ff88',
  },
  connectButtonConnecting: {
    backgroundColor: '#2a1f00',
    borderColor: '#ffaa00',
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  serverButton: {
    backgroundColor: '#1e1e32',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serverButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  serverArrow: {
    color: '#aaaaff',
    fontSize: 24,
  },
  adContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
});
