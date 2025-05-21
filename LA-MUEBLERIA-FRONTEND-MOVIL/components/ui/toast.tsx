import { ToastAndroid, Platform } from 'react-native';
import { useToast as useToastContext } from './toast-provider';

export const useToast = () => {
  return useToastContext();
};

export const toast = {
  success: (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      const event = new CustomEvent('SHOW_TOAST', {
        detail: { message, type: 'success' },
      });
      document?.dispatchEvent(event);
    }
  },
  error: (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      const event = new CustomEvent('SHOW_TOAST', {
        detail: { message, type: 'error' },
      });
      document?.dispatchEvent(event);
    }
  },
};