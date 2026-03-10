import { create } from 'zustand';

export type VpnStatus = 'disconnected' | 'connecting' | 'connected';
export type UserPlan = 'free' | 'premium';

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
  plan: UserPlan;
  
  // Действия
  setStatus: (status: VpnStatus) => void;
  setSelectedServer: (server: Server) => void;
  setPlan: (plan: UserPlan) => void;
}

export const useVpnStore = create<VpnState>((set) => ({
  // Начальные значения
  status: 'disconnected',
  selectedServer: null,
  plan: 'free',

  // Действия
  setStatus: (status) => set({ status }),
  setSelectedServer: (server) => set({ selectedServer: server }),
  setPlan: (plan) => set({ plan }),
}));