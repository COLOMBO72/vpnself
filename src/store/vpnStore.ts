import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type VpnStatus = 'disconnected' | 'connecting' | 'connected' | 'disconnecting' | 'error';
export type UserPlan = 'free' | 'premium';

export interface User {
  id: string;
  email: string;
  plan: UserPlan;
  createdAt: string;
  subscriptionExpiresAt?: string;
}

export interface Server {
  id: string;
  name: string;
  country: string;
  flag: string;
  ping: number;
  isPremium: boolean;
  comingSoon?: boolean;
}

interface VpnState {
  status: VpnStatus;
  selectedServer: Server | null;
  user: User | null;
  token: string | null;
  plan: UserPlan;
  isHydrated: boolean;

  setStatus: (status: VpnStatus) => void;
  setSelectedServer: (server: Server) => void;
  setPlan: (plan: UserPlan) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
}

export const useVpnStore = create<VpnState>((set) => ({
  status: 'disconnected',
  selectedServer: null,
  user: null,
  token: null,
  plan: 'free',
  isHydrated: false,

  setStatus: (status) => set({ status }),
  setSelectedServer: (server) => set({ selectedServer: server }),
  setPlan: async (plan) => {
    await AsyncStorage.setItem('plan', plan);
    set({ plan });
  },
  setUser: async (user) => {
    if (user) {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem('user');
    }
    set({ user });
  },
  setToken: async (token) => {
    if (token) {
      await AsyncStorage.setItem('token', token);
    } else {
      await AsyncStorage.removeItem('token');
    }
    set({ token });
  },
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('plan');
    await AsyncStorage.removeItem('user');
    set({
      user: null,
      token: null,
      plan: 'free',
      status: 'disconnected',
      selectedServer: null,
    });
  },
  hydrate: async () => {
    const token = await AsyncStorage.getItem('token');
    const plan = (await AsyncStorage.getItem('plan')) as UserPlan | null;
    const userStr = await AsyncStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    set({
      token,
      plan: plan || 'free',
      user,
      isHydrated: true,
    });
  },
}));
