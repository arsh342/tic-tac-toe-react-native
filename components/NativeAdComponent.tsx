import React, { useEffect, useState } from 'react';
import { Text, Image } from 'react-native';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
  NativeAdEventType,
} from 'react-native-google-mobile-ads';

interface NativeAdComponentProps {
  adUnitId: string;
}

const NativeAdComponent: React.FC<NativeAdComponentProps> = ({ adUnitId }) => {
  const [nativeAd, setNativeAd] = useState<NativeAd>();

  useEffect(() => {
    NativeAd.createForAdRequest(adUnitId)
      .then(setNativeAd)
      .catch(console.error);
  }, [adUnitId]);

  useEffect(() => {
    if (!nativeAd) return;
    const listener = nativeAd.addAdEventListener(
      NativeAdEventType.CLICKED,
      () => {
        console.log('Native ad clicked');
      }
    );
    return () => {
      nativeAd.destroy();
    };
  }, [nativeAd]);

  if (!nativeAd) {
    return null;
  }

  return (
    <NativeAdView
      nativeAd={nativeAd}
      style={{ width: '50%', alignSelf: 'center' }}
    >
      {nativeAd.icon && (
        <NativeAsset assetType={NativeAssetType.ICON}>
          <Image source={{ uri: nativeAd.icon.url }} width={24} height={24} />
        </NativeAsset>
      )}
      <NativeAsset assetType={NativeAssetType.HEADLINE}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {nativeAd.headline}
        </Text>
      </NativeAsset>
      <Text>Sponsored</Text>
      <NativeMediaView
        resizeMode={'contain'}
        style={{ aspectRatio: 1, width: '100%' }}
      />
      {/* Add more assets as needed */}
    </NativeAdView>
  );
};

export default NativeAdComponent;
