import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authApi } from '../api/auth';
import { useVpnStore } from '../store/vpnStore';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { setUser, setToken, setPlan } = useVpnStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Введите email и пароль');
      return;
    }

    setLoading(true);
    try {
      const result = isRegister
        ? await authApi.register(email, password)
        : await authApi.login(email, password);

      setUser(result.user);
      setToken(result.token);
      setPlan(result.user.plan);

      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Ошибка', error.response?.data?.error || 'Что-то пошло не так');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>SELFVPN</Text>
      <Text style={styles.subtitle}>{isRegister ? 'Создать аккаунт' : 'Войти в аккаунт'}</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#555566"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#555566"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isRegister ? 'Зарегистрироваться' : 'Войти'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
          <Text style={styles.switchText}>
            {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#aaaaff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#1e1e32',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3333ff',
  },
  submitButton: {
    backgroundColor: '#3333ff',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    color: '#aaaaff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
