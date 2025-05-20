import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toasts.length > 0) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto dismiss after 3 seconds
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setToasts((prevToasts) => prevToasts.slice(1));
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const getToastColor = (type: 'success' | 'error') => {
    return type === 'success' ? '#4CAF50' : '#F44336';
  };

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container}>
      {toasts.map((toast) => (
        <Animated.View
          key={toast.id}
          style={[
            styles.toast,
            { backgroundColor: getToastColor(toast.type) },
            { opacity: fadeAnim },
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
          <TouchableOpacity
            onPress={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: 500,
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  closeButton: {
    marginLeft: 12,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
  },
});