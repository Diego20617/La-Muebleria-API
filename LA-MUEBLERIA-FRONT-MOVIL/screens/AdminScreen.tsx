import React, { useState, useEffect } from 'react';
import { productoAPI, Producto } from '../services/api';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import ProductModal, { ProductData } from '../components/ProductModal';
import { toast } from 'sonner-native';

interface AdminCard {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

const adminCards: AdminCard[] = [
  {
    id: 'inventory',
    title: 'Gestión de Inventario',
    subtitle: 'Administrar inventario de productos',
    icon: 'inventory',
    color: '#007AFF'
  },
  {
    id: 'users',
    title: 'Gestión de Usuarios',
    subtitle: 'Administrar cuentas de usuario',
    icon: 'people',
    color: '#FF3B30'
  },
  {
    id: 'products',
    title: 'Gestión de Productos',
    subtitle: 'Administrar los productos en tienda',
    icon: 'shopping-bag',
    color: '#5856D6'
  }
];

const ProductItem = ({ product, onEdit, onDelete }: {product: ProductData, 
  onEdit: (product: ProductData) => void,
  onDelete: (id: string) => void 
}) => (
  <View style={styles.productItem}>    <View style={styles.productItemLeft}>
      <Image source={{ uri: product.imageUrl }} style={styles.productThumbnail} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text style={styles.productPrice}>$ {product.price}</Text>
        <Text style={styles.productColor}>Color: {product.color}</Text>
        <Text style={styles.productDimensions}>
          {product.dimensions.height}x{product.dimensions.width}x{product.dimensions.depth} cm
        </Text>
      </View>
    </View>
    <View>
      <Text style={styles.stockLabel}>Stock</Text>
      <Text style={styles.stockValue}>{product.stock} unidades</Text>
      <View style={styles.productActions}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => onEdit(product)}
        >
          <MaterialIcons name="edit" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => onDelete(product.id)}
        >
          <MaterialIcons name="delete" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default function AdminScreen() {
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productoAPI.getAll();
      setProducts(data);
    } catch (error) {
      toast.error('Error al cargar los productos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalVisible(true);
  };

  const handleEditProduct = (product: ProductData) => {
    setEditingProduct(product);
    setIsProductModalVisible(true);
  };  const handleDeleteProduct = async (productId: string) => {
    try {
      await productoAPI.delete(productId);
      await loadProducts();
      toast.success('Producto eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el producto');
      console.error(error);
    }
  };  const handleSaveProduct = async (productData: Producto) => {
    try {
      if (editingProduct) {
        await productoAPI.update(editingProduct.id!, productData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await productoAPI.create(productData);
        toast.success('Producto agregado exitosamente');
      }
      await loadProducts();
      setIsProductModalVisible(false);
    } catch (error) {
      toast.error('Error al guardar el producto');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panel de Administración</Text>
        <TouchableOpacity>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {adminCards.map((card) => (
          <TouchableOpacity key={card.id} style={[styles.card, { backgroundColor: card.color }]}>
            <MaterialIcons name={card.icon} size={32} color="white" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Agregar Producto</Text>
        </TouchableOpacity>

        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Productos</Text>
          {products.map(product => (
            <ProductItem
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </View>
      </ScrollView>

      <ProductModal
        isVisible={isProductModalVisible}
        onClose={() => setIsProductModalVisible(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  productItemLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  productThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productColor: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  productDimensions: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 15,
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  productsSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
    marginTop: 4,
  },
  stockLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
    marginTop: 2,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editButton: {
    padding: 4,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
});