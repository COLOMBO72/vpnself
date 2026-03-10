import MobileAds, {
  InterstitialAd,
  AdEventType,
  TestIds,
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';

// Тестовые ID (заменить на реальные перед публикацией)
export const AD_UNIT_IDS = {
  banner: TestIds.BANNER,
  interstitial: TestIds.INTERSTITIAL,
};

let interstitialAd: InterstitialAd | null = null;

export const AdService = {
  async initialize(): Promise<void> {
    await MobileAds().initialize();
  },

  loadInterstitial(): void {
    interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial, {
      requestNonPersonalizedAdsOnly: true,
    });

    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Interstitial loaded');
    });

    interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Interstitial error:', error);
    });

    interstitialAd.load();
  },

  async showInterstitial(): Promise<void> {
    if (interstitialAd) {
      await interstitialAd.show();
      // Загружаем следующую рекламу
      AdService.loadInterstitial();
    }
  },
};