import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../../config/api';
import { toast } from './toast';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Cargar token almacenado al iniciar
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Error loading token:', error);
    }
  };      const login = async (email: string, password: string) => {
        try {
          // Para credenciales de administrador hardcodeadas
          if (email === 'Admin@admin.com' && password === 'Adminadmin') {
            const fakeToken = 'admin-token-' + Date.now();
            await AsyncStorage.setItem('userToken', fakeToken);
            setToken(fakeToken);
            toast.success('Bienvenido Administrador');
            return true;
          }

          // Si no son las credenciales hardcodeadas, intentar con el backend
          const response = await fetch(ENDPOINTS.auth.login, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

      if (response.ok && data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        setToken(data.token);
        return true;
      } else {
        toast.error(data.message || 'Error al iniciar sesión');
        return false;
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor');
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setToken(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        isAuthenticated: !!token,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};