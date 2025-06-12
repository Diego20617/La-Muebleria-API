import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../components/ui/auth-context';
import { ENDPOINTS } from '../config/api';
import { toast } from '../components/ui/toast';

interface InventoryItem {
  _id: string;
  cantidad: string;
  id_producto: string;
  id_material: string;
}

export default function HomeScreen({ navigation }) {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace('Login');
    }
  }, [isAuthenticated]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [cantidad, setCantidad] = useState('');
  const [idProducto, setIdProducto] = useState('');
  const [idMaterial, setIdMaterial] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);      const response = await fetch(ENDPOINTS.inventory.list);
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      toast.error('Error al cargar el inventario');
    } finally {
      setLoading(false);
    }
  };

  const addInventoryItem = async () => {
    try {
      setLoading(true);      const response = await fetch(ENDPOINTS.inventory.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cantidad: `${cantidad} unidades`,
          id_producto: idProducto,
          id_material: idMaterial,
        }),
      });

      if (response.ok) {
        toast.success('Item agregado exitosamente');
        fetchInventory();
        // limpiar los campos de aja
        setCantidad('');
        setIdProducto('');
        setIdMaterial('');
      } else {
        toast.error('Error al agregar el item');
      }
    } catch (error) {
      toast.error('Error al agregar el item');
    } finally {
      setLoading(false);
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      setLoading(true);      const response = await fetch(ENDPOINTS.inventory.delete(id), {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Item eliminado exitosamente');
        fetchInventory();
      } else {
        toast.error('Error al eliminar el item');
      }
    } catch (error) {
      toast.error('Error al eliminar el item');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Cantidad: {item.cantidad}</Text>
        <Text>ID Producto: {item.id_producto}</Text>
        <Text>ID Material: {item.id_material}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteInventoryItem(item._id)}
      >
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );  return (
    <View style={styles.container}>      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('Shop')}
        >
          <MaterialIcons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>        <View style={styles.headerRight}>
          <Text style={styles.header}>Panel de Administración</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="#2c3e50" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Products')}
        >
          <MaterialIcons name="inventory" size={24} color="white" />
          <Text style={styles.navButtonText}>Gestionar Productos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Materials')}
        >
          <MaterialIcons name="category" size={24} color="white" />
          <Text style={styles.navButtonText}>Gestionar Materiales</Text>
        </TouchableOpacity>
      </View>
      
      {/* añadir obje */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Cantidad"
          value={cantidad}
          onChangeText={setCantidad}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="ID Producto"
          value={idProducto}
          onChangeText={setIdProducto}
        />
        <TextInput
          style={styles.input}
          placeholder="ID Material"
          value={idMaterial}
          onChangeText={setIdMaterial}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addInventoryItem}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Agregar Item</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={inventory}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },  backButton: {
    padding: 8,
    marginRight: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    color: '#2c3e50',
  },  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#2c3e50',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  form: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deleteButton: {
    padding: 8,
  },
});