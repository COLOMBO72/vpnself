import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { useVpnStore } from './src/store/vpnStore';
import { subscriptionApi } from './src/api/subscription';

export default function App() {
  const { token, setPlan, hydrate, isHydrated } = useVpnStore();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!token) return;
      try {
        const { plan } = await subscriptionApi.getStatus();
        setPlan(plan);
      } catch (error) {
        console.log('Ошибка проверки подписки:', error);
      }
    };

    if (isHydrated && token) {
      checkSubscription();
    }
  }, [isHydrated, token]);

  if (!isHydrated) return null;

  return <AppNavigator />;
}
// export default function App() {
//   const { token, setPlan, hydrate, isHydrated } = useVpnStore();

//   useEffect(() => {
//     hydrate();
//     AdService.initialize().then(() => {
//       console.log('✅ AdMob инициализирован');
//     });
//   }, []);

//   useEffect(() => {
//     const checkSubscription = async () => {
//       if (!token) return;
//       try {
//         const { plan } = await subscriptionApi.getStatus();
//         setPlan(plan);
//         console.log('✅ Статус подписки:', plan);
//       } catch (error) {
//         console.log('Ошибка проверки подписки:', error);
//       }
//     };

//     if (isHydrated && token) {
//       checkSubscription();
//     }
//   }, [isHydrated, token]);

//   if (!isHydrated) return null;

//   return <AppNavigator />;
// }