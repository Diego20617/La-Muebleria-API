import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { toast } from 'sonner-native';

interface ProductModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (product: ProductData) => void;
  editingProduct?: ProductData | null;
}

export interface ProductData {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  color: string;
  dimensions: {
    height: string;
    width: string;
    depth: string;
  };
  imageUrl: string;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isVisible,
  onClose,
  onSave,
  editingProduct
}) => {  const [formData, setFormData] = useState<ProductData>({
    id: Date.now().toString(),
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
    imageUrl: 'https://api.a0.dev/assets/image?text=elegant%20furniture%20piece&aspect=4:3'
  });  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
    } else {
      setFormData({
        id: Date.now().toString(),
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
        imageUrl: 'https://api.a0.dev/assets/image?text=elegant%20furniture%20piece&aspect=4:3'
      });
    }
  }, [editingProduct, isVisible]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: formData.imageUrl }} 
                style={styles.productImage} 
              />              <View style={styles.imageButtons}>
                <TouchableOpacity 
                  style={[styles.imageButton, { backgroundColor: '#007AFF' }]}
                  onPress={async () => {
                    try {
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                      });
                      
                      if (!result.canceled) {
                        setFormData({ ...formData, imageUrl: result.assets[0].uri });
                      }
                    } catch (error) {
                      toast.error('Error al seleccionar la imagen');
                    }
                  }}
                >
                  <MaterialIcons name="photo-library" size={24} color="white" />
                  <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.imageButton, { backgroundColor: '#34C759' }]}
                  onPress={async () => {
                    try {
                      const result = await ImagePicker.launchCameraAsync({
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                      });
                      
                      if (!result.canceled) {
                        setFormData({ ...formData, imageUrl: result.assets[0].uri });
                      }
                    } catch (error) {
                      toast.error('Error al tomar la foto');
                    }
                  }}
                >
                  <MaterialIcons name="camera-alt" size={24} color="white" />
                  <Text style={styles.imageButtonText}>Tomar Foto</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre del Producto</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Ingrese el nombre del producto"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Categoría</Text>
              <TextInput
                style={styles.input}
                value={formData.category}
                onChangeText={(text) => setFormData({ ...formData, category: text })}
                placeholder="Ingrese la categoría"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Precio</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                placeholder="Ingrese el precio"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Stock</Text>
              <TextInput
                style={styles.input}
                value={formData.stock}
                onChangeText={(text) => setFormData({ ...formData, stock: text })}
                placeholder="Ingrese el stock"
                keyboardType="numeric"
              />            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Ingrese la descripción del producto"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Color</Text>
              <TextInput
                style={styles.input}
                value={formData.color}
                onChangeText={(text) => setFormData({ ...formData, color: text })}
                placeholder="Ingrese el color del producto"
              />
            </View>

            <Text style={styles.sectionTitle}>Medidas</Text>
            
            <View style={styles.dimensionsContainer}>
              <View style={styles.dimensionInput}>
                <Text style={styles.label}>Alto (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.dimensions.height}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions, height: text }
                  })}
                  placeholder="Alto"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.dimensionInput}>
                <Text style={styles.label}>Ancho (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.dimensions.width}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions, width: text }
                  })}
                  placeholder="Ancho"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.dimensionInput}>
                <Text style={styles.label}>Profundidad (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.dimensions.depth}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions, depth: text }
                  })}
                  placeholder="Profundidad"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  imageButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  dimensionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dimensionInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductModal;