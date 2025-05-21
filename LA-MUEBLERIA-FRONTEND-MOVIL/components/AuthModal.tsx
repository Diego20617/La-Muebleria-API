import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { toast } from './ui/toast';

interface AuthModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isVisible, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombres: '',
    apellidos: '',
    num_doc: '',
  });

  const handleAuth = () => {
    if (isLogin) {
      // Login logic
      if (formData.email === 'Admin@admin.com' && formData.password === 'Adminadmin') {
        toast.success('Bienvenido Administrador');
        onSuccess();
      } else {
        toast.error('Credenciales inválidas');
      }
    } else {
      // Register logic
      if (!formData.email || !formData.password || !formData.nombres || !formData.apellidos || !formData.num_doc) {
        toast.error('Todos los campos son requeridos');
        return;
      }
      toast.success('Registro exitoso');
      setIsLogin(true);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: 'https://api.a0.dev/assets/image?text=furniture%20store%20elegant%20logo%20minimal&aspect=1:1' }}
            style={styles.logo}
          />

          <Text style={styles.title}>{isLogin ? 'Iniciar Sesión' : 'Registro'}</Text>

          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nombres"
                value={formData.nombres}
                onChangeText={(text) => setFormData({...formData, nombres: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Apellidos"
                value={formData.apellidos}
                onChangeText={(text) => setFormData({...formData, apellidos: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Número de documento"
                value={formData.num_doc}
                onChangeText={(text) => setFormData({...formData, num_doc: text})}
                keyboardType="numeric"
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={formData.password}
            onChangeText={(text) => setFormData({...formData, password: text})}
            secureTextEntry
          />

          <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
            <Text style={styles.authButtonText}>
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchButtonText}>
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  authButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 15,
  },
  switchButtonText: {
    color: '#2c3e50',
    fontSize: 14,
  },
});