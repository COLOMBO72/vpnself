import { create } from 'zustand';

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
}

interface VpnState {
  // VPN
  status: VpnStatus;
  selectedServer: Server | null;

  // Пользователь
  user: User | null;
  token: string | null;
  plan: UserPlan;

  // Действия
  setStatus: (status: VpnStatus) => void;
  setSelectedServer: (server: Server) => void;
  setPlan: (plan: UserPlan) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export const useVpnStore = create<VpnState>((set) => ({
  status: 'disconnected',
  selectedServer: null,
  user: null,
  token: null,
  plan: 'free',

  setStatus: (status) => set({ status }),
  setSelectedServer: (server) => set({ selectedServer: server }),
  setPlan: (plan) => set({ plan }),
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
}));