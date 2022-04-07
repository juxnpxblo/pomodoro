import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '../../lib/tailwind';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <View style={tw`bg-red-2 h-full px-4 py-3`}>
      <SafeAreaView>
        <View style={tw`h-full`}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

export default BaseLayout;
