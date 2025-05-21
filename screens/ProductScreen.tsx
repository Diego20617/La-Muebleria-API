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
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../components/ui/auth-context';
import { ENDPOINTS } from '../config/api';
import { toast } from '../components/ui/toast';

interface Dimensions {
  height: string;
  width: string;
  depth: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  color: string;
  dimensions: Dimensions;
  imageUrl: string;
  tipo_producto_id: string;
  paymentScript?: string;   // añadido
}

export default function ProductScreen() {
  const navigation = useNavigation();
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace('Login');
    }
  }, [isAuthenticated]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);  const [formData, setFormData] = useState<Omit<Product, '_id'>>({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    color: '',
    dimensions: {
      height: '',
      width: '',
      depth: ''
    },
    imageUrl: '',
    tipo_producto_id: '',
    paymentScript: ''     // ← new field for raw HTML snippet
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);      const response = await fetch(ENDPOINTS.products.list);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    try {
      setLoading(true);      const response = await fetch(ENDPOINTS.products.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },      body: JSON.stringify({
        ...formData,
        paymentScript: formData.paymentScript  // include in payload
      }),
      });

      if (response.ok) {
        toast.success('Producto agregado exitosamente');
        fetchProducts();        // formatear formulario
        setFormData({
          name: '',
          category: '',
          price: '',
          stock: '',
          description: '',
          color: '',
          dimensions: {
            height: '',
            width: '',
            depth: ''
          },
          imageUrl: '',
          tipo_producto_id: '',
          paymentScript: ''
        });
      } else {
        toast.error('Error al agregar el producto');
      }
    } catch (error) {
      toast.error('Error al agregar el producto');
    } finally {
      setLoading(false);
    }
  };  const handleEdit = async () => {
    if (!editingProduct) return;

    try {
      setLoading(true);      const response = await fetch(ENDPOINTS.products.update(editingProduct._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },      body: JSON.stringify({
          name: editingProduct.name,
          category: editingProduct.category,
          price: editingProduct.price,
          stock: editingProduct.stock,
          description: editingProduct.description,
          color: editingProduct.color,
          dimensions: editingProduct.dimensions,
          imageUrl: editingProduct.imageUrl,
          tipo_producto_id: editingProduct.tipo_producto_id,
          paymentScript: editingProduct.paymentScript  // include new field
        }),
      });

      if (response.ok) {
        toast.success('Producto actualizado exitosamente');
        setIsEditModalVisible(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        toast.error('Error al actualizar el producto');
      }
    } catch (error) {
      toast.error('Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);      const response = await fetch(ENDPOINTS.products.delete(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Producto eliminado exitosamente');
        fetchProducts();
      } else {
        toast.error('Error al eliminar el producto');
      }
    } catch (error) {
      toast.error('Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);  const renderItem = ({ item }: { item: Product }) => (    
    <View style={styles.card}>
      <Image
        source={{ 
          uri: item.imageUrl || 'https://api.a0.dev/assets/image?text=elegant%20furniture%20piece&aspect=1:1'
        }}
        style={styles.productImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardText}>Categoría: {item.category}</Text>
        <Text style={styles.cardText}>Precio: ${item.price}</Text>
        <Text style={styles.cardText}>Stock: {item.stock}</Text>
        <Text style={styles.cardText}>Color: {item.color}</Text>
        <Text style={styles.cardText}>Dimensiones: {item.dimensions.height}x{item.dimensions.width}x{item.dimensions.depth} cm</Text>
      </View>      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setEditingProduct(item);
            setIsEditModalVisible(true);
          }}
        >
          <MaterialIcons name="edit" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteProduct(item._id)}
        >
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );  return (
    <View style={styles.container}>
      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Producto</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre del producto"
              value={editingProduct?.name}
              onChangeText={(text) => setEditingProduct(prev => ({...prev, name: text}))}
            />
            <TextInput
              style={styles.input}
              placeholder="Categoría"
              value={editingProduct?.category}
              onChangeText={(text) => setEditingProduct(prev => ({...prev, category: text}))}
            />
            <TextInput
              style={styles.input}
              placeholder="Precio"
              value={editingProduct?.price}
              onChangeText={(text) => setEditingProduct(prev => ({...prev, price: text}))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Stock"
              value={editingProduct?.stock}
              onChangeText={(text) => setEditingProduct(prev => ({...prev, stock: text}))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={editingProduct?.description}
              onChangeText={(text) => setEditingProduct(prev => ({...prev, description: text}))}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Color"
              value={editingProduct?.color}
              onChangeText={(text) => setEditingProduct(prev => ({...prev, color: text}))}
            />
            
            <View style={styles.dimensionsContainer}>
              <Text style={styles.dimensionsTitle}>Dimensiones (cm)</Text>
              <View style={styles.dimensionsInputs}>
                <TextInput
                  style={[styles.input, styles.dimensionInput]}
                  placeholder="Alto"
                  value={editingProduct?.dimensions?.height}
                  onChangeText={(text) => setEditingProduct(prev => ({
                    ...prev,
                    dimensions: {...prev.dimensions, height: text}
                  }))}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, styles.dimensionInput]}
                  placeholder="Ancho"
                  value={editingProduct?.dimensions?.width}
                  onChangeText={(text) => setEditingProduct(prev => ({
                    ...prev,
                    dimensions: {...prev.dimensions, width: text}
                  }))}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, styles.dimensionInput]}
                  placeholder="Profundidad"
                  value={editingProduct?.dimensions?.depth}
                  onChangeText={(text) => setEditingProduct(prev => ({
                    ...prev,
                    dimensions: {...prev.dimensions, depth: text}
                  }))}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.imageInputContainer}>
              <TextInput
                style={[styles.input, styles.imageInput]}
                placeholder="URL de la imagen"
                value={editingProduct?.imageUrl}
                onChangeText={(text) => setEditingProduct(prev => ({...prev, imageUrl: text}))}
              />
              <TouchableOpacity 
                style={styles.imagePickerButton}
                onPress={async () => {
                  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                  
                  if (permissionResult.granted === false) {
                    toast.error('Se necesita permiso para acceder a la galería');
                    return;
                  }

                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1,
                  });

                  if (!result.canceled) {
                    const imageUri = result.assets[0].uri;
                    setEditingProduct(prev => ({...prev, imageUrl: imageUri}));
                  }
                }}
              >
                <Ionicons name="image" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="ID del tipo de producto"
              value={editingProduct?.tipo_producto_id}
              onChangeText={(text) => setEditingProduct(prev => ({...prev, tipo_producto_id: text}))}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsEditModalVisible(false);
                  setEditingProduct(null);
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
          </ScrollView>
        </View>
      </Modal>      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.header}>Gestión de Productos</Text>
      </View>
      
      <ScrollView style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del producto"
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Categoría"
          value={formData.category}
          onChangeText={(text) => setFormData({...formData, category: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Precio"
          value={formData.price}
          onChangeText={(text) => setFormData({...formData, price: text})}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Stock"
          value={formData.stock}
          onChangeText={(text) => setFormData({...formData, stock: text})}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={formData.description}
          onChangeText={(text) => setFormData({...formData, description: text})}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Color"
          value={formData.color}
          onChangeText={(text) => setFormData({...formData, color: text})}
        />
        <View style={styles.dimensionsContainer}>
          <Text style={styles.dimensionsTitle}>Dimensiones (cm)</Text>
          <View style={styles.dimensionsInputs}>
            <TextInput
              style={[styles.input, styles.dimensionInput]}
              placeholder="Alto"
              value={formData.dimensions.height}
              onChangeText={(text) => setFormData({
                ...formData,
                dimensions: {...formData.dimensions, height: text}
              })}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.dimensionInput]}
              placeholder="Ancho"
              value={formData.dimensions.width}
              onChangeText={(text) => setFormData({
                ...formData,
                dimensions: {...formData.dimensions, width: text}
              })}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.dimensionInput]}
              placeholder="Profundidad"
              value={formData.dimensions.depth}
              onChangeText={(text) => setFormData({
                ...formData,
                dimensions: {...formData.dimensions, depth: text}
              })}
              keyboardType="numeric"
            />
          </View>
        </View>        <View style={styles.imageInputContainer}>
          <TextInput
            style={[styles.input, styles.imageInput]}
            placeholder="URL de la imagen"
            value={formData.imageUrl}
            onChangeText={(text) => setFormData({...formData, imageUrl: text})}
          />
          <TouchableOpacity 
            style={styles.imagePickerButton}
            onPress={async () => {
              const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
              
              if (permissionResult.granted === false) {
                toast.error('Se necesita permiso para acceder a la galería');
                return;
              }

              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              });

              if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                // Aquí podrías subir la imagen a tu servidor y obtener una URL
                // Por ahora usaremos la URI local
                setFormData({...formData, imageUrl: imageUri});
              }
            }}
          >
            <Ionicons name="image" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="ID del tipo de producto"
          value={formData.tipo_producto_id}
          onChangeText={(text) => setFormData({...formData, tipo_producto_id: text})}
        />            {/* payment button HTML snippet */}
            <TextInput
              style={[styles.input, {height:100, textAlignVertical:'top'}]}
              placeholder="Pega aquí tu <form>…</form> de ePayco"
              value={editingProduct ? editingProduct.paymentScript : formData.paymentScript}
              onChangeText={(text) => {
                if (editingProduct) {
                  setEditingProduct(prev => ({ ...prev!, paymentScript: text }));
                } else {
                  setFormData(prev => ({ ...prev, paymentScript: text }));
                }
              }}
              multiline
            />

            
<TouchableOpacity 
  style={styles.addButton}
  onPress={addProduct}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Agregar Producto</Text>
            </TouchableOpacity>
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={products}
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
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxHeight: '90%',
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
  },  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
    paddingVertical: 16,
    backgroundColor: '#fff',
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
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    maxHeight: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  dimensionsContainer: {
    marginBottom: 12,
  },
  dimensionsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  dimensionsInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dimensionInput: {
    flex: 1,
    marginHorizontal: 4,
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
  },  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#2c3e50',
  },
  cardText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 4,
  },  deleteButton: {
    padding: 8,
  },
  imageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  imageInput: {
    flex: 1,
    marginBottom: 0,
  },
  imagePickerButton: {
    backgroundColor: '#2c3e50',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});