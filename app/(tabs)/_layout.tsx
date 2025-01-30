import { router, Tabs } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
export default function TabLayout() {
  const colorScheme = useColorScheme();


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerTitleAlign: 'left',
        headerTintColor: '#000',
        tabBarLabel: () => null,
        headerStyle: {

          backgroundColor: '#ffffff'
        },
        headerTitleStyle: {
          padding: 10,
          marginLeft: 15,
          fontSize: 22,
          fontWeight: 'bold'
        },
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
            backgroundColor: '#434343'
          },
        }),
      }}>

      <Tabs.Screen
        name="index"
        options={{

          headerRight: () => (
            <>

              <TouchableOpacity onPress={() => router.push("../notification")}>
                <MaterialIcons name="notifications-active" size={24} color="#000" style={{ marginRight: 20 }} />
              </TouchableOpacity>
              <FontAwesome name="user" size={24} color="black" style={{ marginRight: 30 }} />
            </>
          ),
          title: 'Hello User',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />
        }}
      />
      
      <Tabs.Screen

        name="explore"
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => alert('Wait for redirecting to Customer Service...')}>
              <AntDesign name="customerservice" size={24} color='#000957' style={{ marginRight: 30 }} />
            </TouchableOpacity>
          ),
          title: 'Instructions',
          tabBarIcon: ({ color }) => <AntDesign name="infocirlceo" size={24} color={color} />,
        }}
      />


    </Tabs>
  );
}
