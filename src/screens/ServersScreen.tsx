import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVpnStore, Server } from '../store/vpnStore';
import { serversApi } from '../api/servers';

export default function ServersScreen() {
  const navigation = useNavigation();
  const { selectedServer, setSelectedServer, plan } = useVpnStore();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      const data = await serversApi.getServers();
      setServers(data);
    } catch (error: any) {
      Alert.alert('Ошибка', 'Не удалось загрузить серверы');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectServer = (server: Server) => {
    if (server.comingSoon) {
      Alert.alert('Скоро', 'Этот сервер будет доступен в ближайшее время!');
      return;
    }
    if (server.isPremium && plan === 'free') {
      navigation.navigate('Subscription' as never);
      return;
    }
    setSelectedServer(server);
    navigation.goBack();
  };

  const renderServer = (server: Server) => {
    const isSelected = selectedServer?.id === server.id;
    const isLocked = server.isPremium && plan === 'free';
    const isComingSoon = server.comingSoon;

    return (
      <TouchableOpacity
        key={server.id}
        style={[
          styles.serverItem,
          isSelected && styles.serverItemSelected,
          (isLocked || isComingSoon) && styles.serverItemLocked,
        ]}
        onPress={() => handleSelectServer(server)}
      >
        <Text style={styles.serverFlag}>{server.flag}</Text>
        <View style={styles.serverInfo}>
          <Text style={styles.serverName}>{server.name}</Text>
          <Text style={styles.serverPing}>
            {isComingSoon ? 'Скоро доступно' : server.ping ? `${server.ping} ms` : 'Нет данных'}
          </Text>
        </View>
        <View style={styles.serverRight}>
          {isComingSoon ? (
            <Text style={styles.comingSoonBadge}>Скоро</Text>
          ) : isLocked ? (
            <Text style={styles.lockIcon}>🔒</Text>
          ) : isSelected ? (
            <Text style={styles.checkIcon}>✓</Text>
          ) : null}
          {server.isPremium && !isComingSoon && <Text style={styles.premiumBadge}>Premium</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const freeServers = servers.filter((s) => !s.isPremium);
  const premiumServers = servers.filter((s) => s.isPremium);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1a" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Назад</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Серверы</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3333ff" />
          <Text style={styles.loadingText}>Загрузка серверов...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          <Text style={styles.sectionTitle}>🔓 Бесплатные</Text>
          {freeServers.map((server) => renderServer(server))}

          <Text style={styles.sectionTitle}>💎 Premium</Text>
          {premiumServers.map((server) => renderServer(server))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  backButton: {
    color: '#aaaaff',
    fontSize: 18,
    width: 60,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#aaaaff',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#aaaaff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  serverItem: {
    backgroundColor: '#1e1e32',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  serverItemSelected: {
    borderColor: '#00ff88',
    backgroundColor: '#0a2a1a',
  },
  serverItemLocked: {
    opacity: 0.5,
  },
  serverFlag: {
    fontSize: 28,
    marginRight: 14,
  },
  serverInfo: {
    flex: 1,
  },
  serverName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  serverPing: {
    color: '#888899',
    fontSize: 13,
    marginTop: 2,
  },
  serverRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  lockIcon: {
    fontSize: 16,
  },
  checkIcon: {
    color: '#00ff88',
    fontSize: 20,
    fontWeight: 'bold',
  },
  premiumBadge: {
    color: '#ffaa00',
    fontSize: 11,
    fontWeight: '600',
  },
  comingSoonBadge: {
    color: '#aaaaff',
    fontSize: 11,
    fontWeight: '600',
    backgroundColor: '#2a2a4a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
});
