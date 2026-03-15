import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVpnStore } from '../store/vpnStore';

export default function SubscriptionScreen() {
  const navigation = useNavigation();
  const { plan, user } = useVpnStore();

  const handleOpenTelegram = () => {
    const botUsername = 'veliumvpn_bot'; // замени на username своего бота
    const url = `https://t.me/${botUsername}?start=${user?.id}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1a" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Назад</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Подписка</Text>
        <View style={{ width: 60 }} />
      </View>

      {plan === 'premium' ? (
        <View style={styles.premiumActive}>
          <Text style={styles.premiumActiveIcon}>💎</Text>
          <Text style={styles.premiumActiveTitle}>У тебя Premium!</Text>
          <Text style={styles.premiumActiveText}>
            Наслаждайся максимальной скоростью без рекламы
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.headline}>💎 Узнать о Premium</Text>

          {/* Текущий план */}
          <View style={styles.planCard}>
            <Text style={styles.planLabel}>Текущий план</Text>
            <Text style={styles.planTitle}>🔓 Free</Text>
            <View style={styles.featureList}>
              <Text style={styles.featureBad}>❌ Реклама при подключении</Text>
              <Text style={styles.featureBad}>❌ Скорость до 10 Mbps</Text>
            </View>
          </View>

          {/* Стрелка */}
          <Text style={styles.arrow}>↓</Text>

          {/* Premium план */}
          <View style={styles.premiumCard}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>⭐ Рекомендуем</Text>
            </View>
            <Text style={styles.planTitle}>💎 Premium</Text>
            <View style={styles.featureList}>
              <Text style={styles.featureGood}>✅ Без рекламы</Text>
              <Text style={styles.featureGood}>✅ Скорость до 25 Mbps</Text>
              <Text style={styles.featureGood}>✅ Приоритетное подключение</Text>
              <Text style={styles.featureGood}>✅ Поддержка 24/7</Text>
            </View>

            <TouchableOpacity style={styles.upgradeButton} onPress={handleOpenTelegram}>
              <Text style={styles.upgradeButtonText}>💎 Подробнее</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: { color: '#aaaaff', fontSize: 18, width: 60 },
  title: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  headline: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: '#1e1e32',
    borderRadius: 20,
    padding: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333344',
  },
  premiumCard: {
    backgroundColor: '#1a1a35',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#3333ff',
    marginBottom: 16,
  },
  planLabel: {
    color: '#888899',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  planTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureList: { gap: 8 },
  featureBad: { color: '#888899', fontSize: 14, lineHeight: 20 },
  featureGood: { color: '#ccccdd', fontSize: 14, lineHeight: 20 },
  arrow: {
    color: '#3333ff',
    fontSize: 28,
    textAlign: 'center',
    marginVertical: 8,
  },
  popularBadge: {
    backgroundColor: '#3333ff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  popularText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  upgradeButton: {
    backgroundColor: '#3333ff',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  telegramHint: {
    color: '#555566',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  premiumActive: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 16,
  },
  premiumActiveIcon: { fontSize: 64 },
  premiumActiveTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  premiumActiveText: {
    color: '#888899',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
