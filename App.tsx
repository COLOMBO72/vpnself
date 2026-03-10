import React, { useEffect, useState } from 'react';
import { AdService } from './src/services/AdService';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [adsReady, setAdsReady] = useState(false);
  useEffect(() => {
    AdService.initialize().then(() => {
      console.log('✅ AdMob инициализирован');
      setAdsReady(true);
    });
  }, []);

  return <AppNavigator />;
}
