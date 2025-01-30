import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import NotifiCard from '../../components/NotifiCard';
import { deleteByIndex, getData, removeValue } from '@/lib/Storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';

const Notification = () => {
  const [active, setActive] = useState<number | null>(null);
  const snapPoints = ['30%'];
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [notification, setNotification] = useState<any[]>([]);

  // Fetch notifications from storage
  const fetchNotification = async () => {
    const response = await getData("notification") || [];
    setNotification(response);
  };

  // Open the bottom sheet modal
  const handlePresentModalPress = useCallback((index: number) => {
    setActive(index);
    bottomSheetModalRef.current?.present();
  }, []);

  // Close modal
  const handleClose = () => {
    bottomSheetModalRef.current?.close();
  };

  // Clear all notifications
  const clearNotifications = () => {
    removeValue("notification");
    setNotification([]);
  };

  // Delete a specific notification
  const deleteNotification = async (key: string, index: number) => {
    await deleteByIndex(key, index);
    const updatedNotifications = [...notification];
    updatedNotifications.splice(index, 1);
    setNotification(updatedNotifications);
    handleClose();
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  return (
    <BottomSheetModalProvider>
      <View style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          {notification.length > 0 && (
            <TouchableOpacity onPress={clearNotifications} style={styles.btn}>
              <AntDesign name="delete" size={24} color="#fff" />
              <Text style={styles.btnTxt}>Delete All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notification List */}
        <FlatList 
          data={notification} 
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const date = new Date(item.date);
            const { title, body } = item.request.content;
            return (
              <NotifiCard 
                title={title} 
                body={body} 
                date={date.toLocaleDateString()} 
                index={index} 
                onPress={() => handlePresentModalPress(index)} 
                setActive={setActive} 
              />
            );
          }} 
          contentContainerStyle={styles.container} 
        />

        {/* Bottom Sheet Modal */}
        <BottomSheetModal ref={bottomSheetModalRef} snapPoints={snapPoints}>
          <BottomSheetView style={styles.bottomSheetContainer}>
            <TouchableOpacity 
              style={styles.delBtn} 
              onPress={() => active !== null && deleteNotification("notification", active)}
            >
              <Text style={styles.delTxt}>Delete this notification</Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default Notification;

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  delBtn: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  delTxt: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  btn: {
    backgroundColor: '#2e86c1',
    borderRadius: 40,
    paddingHorizontal: 30,
    paddingVertical: 15,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTxt: {
    color: "#fff",
    fontSize: 16,
  },
});
