import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

interface ProductModalProps {
  isVisible: boolean;
  onClose: () => void;
  product: any;
}

export default function ProductModal({ isVisible, onClose, product }: ProductModalProps) {
  if (!product) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ScrollView style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: product.imageUrl || 'https://api.a0.dev/assets/image?text=elegant%20furniture%20piece&aspect=16:9' }}
            style={styles.productImage}
          />

          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>
            
            <View style={styles.separator} />
            
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{product.description}</Text>

            <View style={styles.separator} />

            <Text style={styles.sectionTitle}>Detalles</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Categoría</Text>
                <Text style={styles.detailValue}>{product.category}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Color</Text>
                <Text style={styles.detailValue}>{product.color}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Stock</Text>
                <Text style={styles.detailValue}>{product.stock} unidades</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <Text style={styles.sectionTitle}>Dimensiones</Text>
            <View style={styles.dimensionsContainer}>
              <View style={styles.dimensionItem}>
                <Text style={styles.dimensionValue}>{product.dimensions.height}</Text>
                <Text style={styles.dimensionLabel}>Alto</Text>
              </View>
              <View style={styles.dimensionItem}>
                <Text style={styles.dimensionValue}>{product.dimensions.width}</Text>
                <Text style={styles.dimensionLabel}>Ancho</Text>
              </View>
              <View style={styles.dimensionItem}>
                <Text style={styles.dimensionValue}>{product.dimensions.depth}</Text>
                <Text style={styles.dimensionLabel}>Profundidad</Text>
              </View>
            </View>            {/* Payment button saved in product */}
            {product.paymentScript ? (
              <WebView
                originWhitelist={['*']}
                source={{ html: product.paymentScript }}
                style={{ height: 80, width: '100%', marginTop: 16 }}
              />
            ) : null}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  productImage: {
    width: '100%',
    height: 300,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  productPrice: {
    fontSize: 20,
    color: '#2c3e50',
    marginTop: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  detailItem: {
    width: '33.33%',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  dimensionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  dimensionItem: {
    alignItems: 'center',
  },
  dimensionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  dimensionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  addToCartButton: {
    backgroundColor: '#2c3e50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});