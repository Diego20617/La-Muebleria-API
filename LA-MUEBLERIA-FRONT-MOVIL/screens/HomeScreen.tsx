import React, { useState, useCallback, useEffect } from 'react';
import { productoAPI, Producto } from '../services/api';
import ProductOverviewModal from '../components/ProductOverviewModal';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import AuthModal from '../components/AuthModal';
import CartModal, { CartItem } from '../components/CartModal';
import { toast } from 'sonner-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const categories = [
  { id: 1, name: 'Salas', icon: 'couch' },
  { id: 2, name: 'Comedores', icon: 'chair' },
  { id: 3, name: 'Recámaras', icon: 'bed' },
  { id: 4, name: 'Oficina', icon: 'desk' },
];



export default function HomeScreen() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [isProductOverviewVisible, setIsProductOverviewVisible] = useState(false);

  const handleAddToCart = useCallback((product: any) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
    toast.success('Producto agregado al carrito');
  }, []);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    setCartItems(currentItems =>
      quantity === 0
        ? currentItems.filter(item => item.id !== id)
        : currentItems.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== id));
    toast.success('Producto eliminado del carrito');
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.storeName}>Mueblería San Bernardo</Text>
      <View style={styles.headerButtons}>
        <TouchableOpacity 
          style={styles.authButton}
          onPress={() => setIsAuthModalVisible(true)}
        >
          <MaterialIcons name="person" size={24} color="#333" />
        </TouchableOpacity>        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => setIsCartModalVisible(true)}
        >
          <MaterialIcons name="shopping-cart" size={24} color="#333" />
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHero = () => (
    <View style={styles.heroContainer}>
      <Image
        source={{ uri: 'https://api.a0.dev/assets/image?text=luxurious%20modern%20living%20room%20furniture%20setup&aspect=16:9' }}
        style={styles.heroImage}
      />
      <View style={styles.heroOverlay}>
        <Text style={styles.heroTitle}>Diseño y Confort</Text>
        <Text style={styles.heroSubtitle}>Transforma tu hogar con estilo</Text>
        <TouchableOpacity style={styles.shopNowButton}>
          <Text style={styles.shopNowText}>Comprar Ahora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Categorías</Text>
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryItem}>
            <FontAwesome5 name={category.icon} size={24} color="#666" />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );  useEffect(() => {
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

  const renderFeaturedProducts = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Productos Destacados</Text>
      {loading ? (
        <Text style={styles.loadingText}>Cargando productos...</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {products.map((product) => (            <TouchableOpacity 
              key={product.id} 
              style={styles.productCard}
              onPress={() => {
                setSelectedProduct(product);
                setIsProductOverviewVisible(true);
              }}
            >
              <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>$ {product.price}</Text>
                <TouchableOpacity 
                  style={styles.addToCartButton}
                  onPress={() => handleAddToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity: 1
                  })}
                >
                  <MaterialIcons name="add-shopping-cart" size={20} color="white" />
                  <Text style={styles.addToCartText}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderValueProps = () => (
    <View style={styles.valuePropsContainer}>
      <View style={styles.valueProp}>
        <MaterialIcons name="local-shipping" size={24} color="#666" />
        <Text style={styles.valuePropText}>Envío Gratis</Text>
      </View>
      <View style={styles.valueProp}>
        <MaterialIcons name="verified" size={24} color="#666" />
        <Text style={styles.valuePropText}>Garantía de Calidad</Text>
      </View>
      <View style={styles.valueProp}>
        <MaterialIcons name="support-agent" size={24} color="#666" />
        <Text style={styles.valuePropText}>Atención 24/7</Text>
      </View>
    </View>
  );  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHero()}
        {renderCategories()}
        {renderFeaturedProducts()}
        {renderValueProps()}
      </ScrollView>
      <AuthModal 
        isVisible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}      />
      <CartModal
        isVisible={isCartModalVisible}
        onClose={() => setIsCartModalVisible(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}      />
      <ProductOverviewModal
        isVisible={isProductOverviewVisible}
        onClose={() => setIsProductOverviewVisible(false)}
        product={selectedProduct}
        onAddToCart={(product) => {
          handleAddToCart({
            id: product.id!,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1
          });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E8B57',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  addToCartText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authButton: {
    padding: 8,
    marginRight: 8,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 16,
  },
  shopNowButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  shopNowText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  categoryItem: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  productCard: {
    width: SCREEN_WIDTH * 0.7,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginTop: 4,
  },
  valuePropsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f9f9f9',
    marginTop: 16,
  },
  valueProp: {
    alignItems: 'center',
  },
  valuePropText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});