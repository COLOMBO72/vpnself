import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';

export default function BannerAdComponent() {
  const [adFailed, setAdFailed] = useState(false);

  if (adFailed) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>📢 Реклама</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={TEST_BANNER_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={() => console.log('✅ Баннер загружен')}
        onAdFailedToLoad={() => setAdFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
    minHeight: 60,
  },
  placeholder: {
    width: '100%',
    height: 60,
    backgroundColor: '#1e1e32',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333344',
    marginVertical: 8,
  },
  placeholderText: {
    color: '#555566',
    fontSize: 13,
  },
});
