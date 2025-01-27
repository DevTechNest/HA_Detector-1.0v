import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { io } from 'socket.io-client';
import { registerForPushNotificationsAsync } from '@/lib/PushNotification';
import * as Notifications from 'expo-notifications';

export default function HomeScreen() {
  const [pulseRate, setPulseRate] = useState<number | null>(null);
  const [o2Level, setO2Level] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  //notification configurations
  const { notification, expoPushToken} = useNotification();
  const { currentlyRunning, isUpdateAvailable, isUpdatePending } =
    Updates.useUpdates();

  const [dummyState, setDummyState] = useState(0);

  if (error) {
    return <ThemedText>Error: {error.message}</ThemedText>;
  }
  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io('https://ha-detector-backend-production.up.railway.app'); 

    socket.on('connect', () => {
      console.log('Connected to the server');
      setLoading(false);
    });

    socket.on('data', (data) => {
      console.log('Data received:', data);
      setPulseRate(data.pulseRate);
      setO2Level(data.oxygenLevel);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Unable to connect to the server. Please try again.');
      setLoading(false);
    });

    // Cleanup the socket connection
    return () => {
      socket.disconnect();
    };
  }, []);
  // //notiffication
  // const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState<Notifications.Notification | undefined>(
  //   undefined
  // );
  // const notificationListener = useRef<Notifications.EventSubscription>();
  // const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log(notification)
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#00796B" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainCard}>
        <Text style={styles.cardTitle}>Check your Health</Text>
        <Text style={styles.cardSubtitle}>
          We provide best quality medical services without further cost
        </Text>
      </View>
      <View style={styles.reportSection}>
        <View style={[styles.reportCard, styles.pulseCard]}>
          <Text style={styles.reportTitle}>Pulse Rate</Text>
          <Text style={styles.reportValue}>
            {pulseRate ? `${pulseRate} bpm` : 'N/A'}
          
          </Text>
        </View>
        <View style={[styles.reportCard, styles.oxygenCard]}>
          <Text style={styles.reportTitle}>O₂ level</Text>
          <Text style={styles.reportValue}>
            {o2Level ? `${o2Level} SaO₂` : 'N/A'}
          </Text>
        </View>
      </View>
      <View style={styles.todayReport}>
        <Text style={styles.dateText}>24 Tue</Text>
        <TouchableOpacity style={styles.checkButton}>
          <Text style={styles.checkButtonText}>Check Now</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerItem}>Home</Text>
        <Text style={styles.footerItem}>Report</Text>
        <Text style={styles.footerItem}>History</Text>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
  },
  header: {
    marginTop: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  greetingText: {
    fontSize: 18,
    color: '#333333',
  },
  usernameText: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  mainCard: {
    backgroundColor: '#E0F7FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796B',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#004D40',
    textAlign: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reportSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  reportCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  pulseCard: {
    backgroundColor: '#FFEBEE',
  },
  oxygenCard: {
    backgroundColor: '#E8F5E9',
  },
  reportTitle: {
    fontSize: 14,
    color: '#333333',
  },
  reportValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
  },
  todayReport: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  checkButton: {
    backgroundColor: '#29B6F6',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 12,
  },
  checkButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
  },
  footerItem: {
    fontSize: 16,
    color: '#757575',
  },
});
