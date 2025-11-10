import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#95a5a6',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bài 1',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bai2"
        options={{
          title: 'Bài 2',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calculator' : 'calculator-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bai3"
        options={{
          title: 'Bài 3',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'color-palette' : 'color-palette-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bai4"
        options={{
          title: 'Bài 4',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'list' : 'list-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}