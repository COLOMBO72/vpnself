import MobileAds, {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const TEST_INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';

let interstitialAd: InterstitialAd | null = null;
let isAdLoaded = false;

export const AdService = {
  async initialize(): Promise<void> {
    await MobileAds().initialize();
    AdService.loadInterstitial();
  },

  loadInterstitial(): void {
    interstitialAd = InterstitialAd.createForAdRequest(TEST_INTERSTITIAL_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      isAdLoaded = true;
      console.log('✅ Interstitial загружен');
    });

    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      isAdLoaded = false;
      AdService.loadInterstitial();
    });

    interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
      isAdLoaded = false;
      console.log('❌ Interstitial ошибка:', error);
    });

    interstitialAd.load();
  },

  async showInterstitial(): Promise<void> {
    if (isAdLoaded && interstitialAd) {
      await interstitialAd.show();
    }
  },

  isLoaded(): boolean {
    return isAdLoaded;
  },
};