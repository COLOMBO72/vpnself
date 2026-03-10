import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVpnStore } from '../store/vpnStore';
import { subscriptionApi } from '../api/subscription';

const FEATURES_FREE = [
  '✅ 3 бесплатных сервера',
  '✅ Базовая защита',
  '❌ Реклама',
  '❌ Низкая скорость (10 Mbps)',
  '❌ Premium серверы недоступны',
];

const FEATURES_PREMIUM = [
  '✅ 8+ серверов по всему миру',
  '✅ Максимальная защита',
  '✅ Без рекламы',
  '✅ Высокая скорость (1 Gbps)',
  '✅ Приоритетное подключение',
];

export default function SubscriptionScreen() {
  const navigation = useNavigation();
  const { plan, setPlan } = useVpnStore();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await subscriptionApi.activate();
      setPlan('premium');
      Alert.alert('Успешно', 'Premium активирован!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось оформить подписку');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = () => {
    Alert.alert('Восстановление', 'Покупки восстановлены');
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

      <Text style={styles.headline}>Выбери свой план</Text>
      <Text style={styles.subheadline}>Используй VPN бесплатно или получи максимум с Premium</Text>

      {/* Free план */}
      <View style={[styles.planCard, plan === 'free' && styles.planCardActive]}>
        <View style={styles.planHeader}>
          <Text style={styles.planTitle}>🔓 Free</Text>
          <Text style={styles.planPrice}>0 ₽</Text>
        </View>
        {FEATURES_FREE.map((feature, index) => (
          <Text key={index} style={styles.featureText}>
            {feature}
          </Text>
        ))}
        {plan === 'free' && (
          <View style={styles.currentPlanBadge}>
            <Text style={styles.currentPlanText}>Текущий план</Text>
          </View>
        )}
      </View>

      {/* Premium план */}
      <View
        style={[styles.planCard, styles.premiumCard, plan === 'premium' && styles.planCardActive]}
      >
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>⭐ Популярный</Text>
        </View>
        <View style={styles.planHeader}>
          <Text style={styles.planTitle}>💎 Premium</Text>
          <View>
            <Text style={styles.planPrice}>299 ₽/мес</Text>
            <Text style={styles.planPriceAnnual}>или 1990 ₽/год</Text>
          </View>
        </View>
        {FEATURES_PREMIUM.map((feature, index) => (
          <Text key={index} style={styles.featureText}>
            {feature}
          </Text>
        ))}
        {plan === 'premium' ? (
          <View style={styles.currentPlanBadge}>
            <Text style={styles.currentPlanText}>Текущий план</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={handleSubscribe}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.subscribeButtonText}>Попробовать Premium</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity onPress={handleRestore}>
        <Text style={styles.restoreText}>Восстановить покупку</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Подписка автоматически продлевается. Отменить можно в настройках магазина.
      </Text>
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
    marginBottom: 8,
  },
  subheadline: {
    color: '#888899',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  planCard: {
    backgroundColor: '#1e1e32',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  planCardActive: { borderColor: '#00ff88' },
  premiumCard: { borderColor: '#3333ff' },
  popularBadge: {
    backgroundColor: '#3333ff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  popularText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  planPrice: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', textAlign: 'right' },
  planPriceAnnual: { color: '#888899', fontSize: 12, textAlign: 'right', marginTop: 2 },
  featureText: { color: '#ccccdd', fontSize: 14, marginBottom: 8, lineHeight: 20 },
  currentPlanBadge: {
    backgroundColor: '#003322',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  currentPlanText: { color: '#00ff88', fontSize: 14, fontWeight: '600' },
  subscribeButton: {
    backgroundColor: '#3333ff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  subscribeButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  restoreText: {
    color: '#aaaaff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  disclaimer: { color: '#555566', fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
