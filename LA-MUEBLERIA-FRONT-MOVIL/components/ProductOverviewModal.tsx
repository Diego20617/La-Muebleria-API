import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Producto } from '../services/api';

interface ProductOverviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  product: Producto | null;
  onAddToCart: (product: Producto) => void;
}

const ProductOverviewModal: React.FC<ProductOverviewModalProps> = ({
  isVisible,
  onClose,
  product,
  onAddToCart,
}) => {
  if (!product) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
            
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>$ {product.price}</Text>
              
              <View style={styles.stockInfo}>
                <MaterialIcons name="inventory" size={20} color="#666" />
                <Text style={styles.stockText}>Stock disponible: {product.stock} unidades</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.description}>{product.description}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Detalles</Text>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="category" size={20} color="#666" />
                    <Text style={styles.detailLabel}>Categoría</Text>
                    <Text style={styles.detailValue}>{product.category}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="palette" size={20} color="#666" />
                    <Text style={styles.detailLabel}>Color</Text>
                    <Text style={styles.detailValue}>{product.color}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dimensiones</Text>
                <View style={styles.dimensionsContainer}>
                  <View style={styles.dimensionItem}>
                    <MaterialIcons name="height" size={20} color="#666" />
                    <Text style={styles.dimensionLabel}>Alto</Text>
                    <Text style={styles.dimensionValue}>{product.dimensions.height} cm</Text>
                  </View>
                  <View style={styles.dimensionItem}>
                    <MaterialIcons name="straighten" size={20} color="#666" />
                    <Text style={styles.dimensionLabel}>Ancho</Text>
                    <Text style={styles.dimensionValue}>{product.dimensions.width} cm</Text>
                  </View>
                  <View style={styles.dimensionItem}>
                    <MaterialIcons name="square-foot" size={20} color="#666" />
                    <Text style={styles.dimensionLabel}>Profundidad</Text>
                    <Text style={styles.dimensionValue}>{product.dimensions.depth} cm</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.addToCartButton}
              onPress={() => {
                onAddToCart(product);
                onClose();
              }}
            >
              <MaterialIcons name="shopping-cart" size={24} color="white" />
              <Text style={styles.addToCartText}>Agregar al Carrito</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 16,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stockText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  detailItem: {
    width: '50%',
    padding: 8,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginTop: 2,
  },
  dimensionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dimensionItem: {
    alignItems: 'center',
    flex: 1,
  },
  dimensionLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  dimensionValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginTop: 2,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  addToCartButton: {
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  addToCartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ProductOverviewModal;