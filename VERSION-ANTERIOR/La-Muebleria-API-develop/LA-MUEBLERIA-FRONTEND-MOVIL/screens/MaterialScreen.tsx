import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { toast } from '../components/ui/toast';
import { ENDPOINTS } from '../config/api';

interface Material {
  _id: string;
  material: string;
}

export default function MaterialScreen() {
  const navigation = useNavigation();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);  const [newMaterial, setNewMaterial] = useState('');
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const fetchMaterials = async () => {
    try {
      setLoading(true);      const response = await fetch(ENDPOINTS.materials.list);
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      toast.error('Error al cargar los materiales');
    } finally {
      setLoading(false);
    }
  };

  const addMaterial = async () => {
    if (!newMaterial.trim()) {
      toast.error('El nombre del material es requerido');
      return;
    }

    try {
      setLoading(true);      const response = await fetch(ENDPOINTS.materials.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ material: newMaterial }),
      });

      if (response.ok) {
        toast.success('Material agregado exitosamente');
        setNewMaterial('');
        fetchMaterials();
      } else {
        toast.error('Error al agregar el material');
      }
    } catch (error) {
      toast.error('Error al agregar el material');
    } finally {
      setLoading(false);
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      setLoading(true);      const response = await fetch(ENDPOINTS.materials.delete(id), {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Material eliminado exitosamente');
        fetchMaterials();
      } else {
        toast.error('Error al eliminar el material');
      }
    } catch (error) {
      toast.error('Error al eliminar el material');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);  const handleEdit = async () => {
    if (!editingMaterial?.material.trim()) {
      toast.error('El nombre del material es requerido');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3005/api/material/${editingMaterial._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ material: editingMaterial.material }),
      });

      if (response.ok) {
        toast.success('Material actualizado exitosamente');
        setIsEditModalVisible(false);
        setEditingMaterial(null);
        fetchMaterials();
      } else {
        toast.error('Error al actualizar el material');
      }
    } catch (error) {
      toast.error('Error al actualizar el material');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Material }) => (
    <View style={styles.card}>
      <Text style={styles.materialName}>{item.material}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setEditingMaterial(item);
            setIsEditModalVisible(true);
          }}
        >
          <MaterialIcons name="edit" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteMaterial(item._id)}
        >
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );  return (
    <View style={styles.container}>
      {/* editar modla */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Material</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del material"
              value={editingMaterial?.material || ''}
              onChangeText={(text) => setEditingMaterial(prev => ({...prev, material: text}))}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsEditModalVisible(false);
                  setEditingMaterial(null);
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleEdit}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.header}>Gestión de Materiales</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del material"
          value={newMaterial}
          onChangeText={setNewMaterial}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={addMaterial}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Agregar Material</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={materials}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          style={styles.list}
        />
      )}
    </View>
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
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#2c3e50',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    flexDirection: 'row',
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
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    color: '#2c3e50',
  },
  form: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2c3e50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  materialName: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
});