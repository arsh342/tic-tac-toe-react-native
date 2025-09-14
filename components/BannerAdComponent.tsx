import React, { useRef } from 'react';
import { View } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  useForeground,
} from 'react-native-google-mobile-ads';

// Use the production ad unit ID for banner ads
const adUnitId ='ca-app-pub-1944520057755652/6977249842';

const BannerAdComponent = () => {
  const bannerRef = useRef<BannerAd>(null);

  useForeground(() => {
    bannerRef.current?.load();
  });

  return (
    <View
      style={{
        width: '100%',
        height: 50,
        alignSelf: 'center',
        justifyContent: 'center',
      }}
    >
      <BannerAd
        ref={bannerRef}
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  );
};

export default BannerAdComponent;
