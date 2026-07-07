import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0a1a0f', borderTopColor: '#1a2e1f' },
        tabBarActiveTintColor: '#1D9E75',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scan 🌶️',
        }}
      />
    </Tabs>
  );
}
