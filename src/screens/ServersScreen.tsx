import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVpnStore, Server } from '../store/vpnStore';

const SERVERS: Server[] = [
  // Free серверы
  { id: '1', name: 'Германия', country: 'DE', flag: '🇩🇪', ping: 45, isPremium: false },
  { id: '2', name: 'Нидерланды', country: 'NL', flag: '🇳🇱', ping: 52, isPremium: false },
  { id: '3', name: 'Финляндия', country: 'FI', flag: '🇫🇮', ping: 38, isPremium: false },
  // Premium серверы
  { id: '4', name: 'США — Нью-Йорк', country: 'US', flag: '🇺🇸', ping: 110, isPremium: true },
  { id: '5', name: 'Япония — Токио', country: 'JP', flag: '🇯🇵', ping: 180, isPremium: true },
  { id: '6', name: 'Великобритания', country: 'GB', flag: '🇬🇧', ping: 65, isPremium: true },
  { id: '7', name: 'Канада', country: 'CA', flag: '🇨🇦', ping: 120, isPremium: true },
  { id: '8', name: 'Сингапур', country: 'SG', flag: '🇸🇬', ping: 200, isPremium: true },
];

export default function ServersScreen() {
  const navigation = useNavigation();
  const { selectedServer, setSelectedServer, plan } = useVpnStore();

  const handleSelectServer = (server: Server) => {
    if (server.isPremium && plan === 'free') {
      navigation.navigate('Subscription' as never);
      return;
    }
    setSelectedServer(server);
    navigation.goBack();
  };

  const renderServer = ({ item }: { item: Server }) => {
    const isSelected = selectedServer?.id === item.id;
    const isLocked = item.isPremium && plan === 'free';

    return (
      <TouchableOpacity
        style={[
          styles.serverItem,
          isSelected && styles.serverItemSelected,
          isLocked && styles.serverItemLocked,
        ]}
        onPress={() => handleSelectServer(item)}
      >
        <Text style={styles.serverFlag}>{item.flag}</Text>
        <View style={styles.serverInfo}>
          <Text style={styles.serverName}>{item.name}</Text>
          <Text style={styles.serverPing}>{item.ping} ms</Text>
        </View>
        <View style={styles.serverRight}>
          {isLocked ? (
            <Text style={styles.lockIcon}>🔒</Text>
          ) : isSelected ? (
            <Text style={styles.checkIcon}>✓</Text>
          ) : null}
          {item.isPremium && <Text style={styles.premiumBadge}>Premium</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const freeServers = SERVERS.filter((s) => !s.isPremium);
  const premiumServers = SERVERS.filter((s) => s.isPremium);

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

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.sectionTitle}>🔓 Бесплатные</Text>
        {freeServers.map((server) => renderServer({ item: server }))}

        <Text style={styles.sectionTitle}>💎 Premium</Text>
        {premiumServers.map((server) => renderServer({ item: server }))}
      </ScrollView>
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
  sectionTitle: {
    color: '#aaaaff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    paddingHorizontal: 24,
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
    opacity: 0.6,
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
});
