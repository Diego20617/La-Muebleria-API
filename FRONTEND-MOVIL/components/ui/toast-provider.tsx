import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export const ToastContext = React.createContext<{
  showToast: (message: string, type: 'success' | 'error') => void;
}>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  useEffect(() => {
    if (toasts.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setToasts(prev => prev.slice(1));
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <View style={styles.container}>
          {toasts.map((toast) => (
            <Animated.View
              key={toast.id}
              style={[
                styles.toast,
                { backgroundColor: toast.type === 'success' ? '#4CAF50' : '#F44336' },
                { opacity: fadeAnim }
              ]}
            >
              <Text style={styles.text}>{toast.message}</Text>
            </Animated.View>
          ))}
        </View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 16,
    minWidth: 250,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});