import React, { useState, useEffect, useMemo } from 'react';
import ProductModal from '../components/ProductModal';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from '../components/ui/toast';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';  // ← added
import { ENDPOINTS } from '../config/api';
import PaymentButton from '../components/PaymentButton';

export default function ShopScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);  const [showProductModal, setShowProductModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);      const response = await fetch(ENDPOINTS.products.list);
      const data = await response.json();
      setProducts(data);
    } catch (error) {      toast.error('Error al cargar los productos. Por favor, intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();  }, []);

  useEffect(() => {
    // Cargar favoritos almacenados
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    loadFavorites();
  }, []);

  const toggleFavorite = async (productId: string) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    
    setFavorites(newFavorites);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      toast.success(favorites.includes(productId) ? 'Eliminado de favoritos' : 'Agregado a favoritos');
    } catch (error) {
      toast.error('Error al actualizar favoritos');
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);
  const categories = [
    { name: 'Salas', icon: 'weekend' },
    { name: 'Comedores', icon: 'chair' },
    { name: 'Recámaras', icon: 'bed' },
    { name: 'Oficina', icon: 'desk' },
  ];

  return (
    <ScrollView style={styles.container}>      {/* barra de busqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Mueblería San Bernardo</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Ionicons name="person-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartButton}>
            <MaterialIcons name="shopping-cart" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: 'https://api.a0.dev/assets/image?text=modern%20luxury%20living%20room%20with%20elegant%20furniture&aspect=16:9' }}
          style={styles.heroImage}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Diseño y Confort</Text>
          <Text style={styles.heroSubtitle}>Transforma tu hogar con estilo</Text>
          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>Comprar Ahora</Text>
          </TouchableOpacity>
        </View>
      </View>      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.categoryChip,
              !selectedCategory && styles.categoryChipSelected
            ]}
            onPress={() => setSelectedCategory('')}
          >
            <Text style={[
              styles.categoryChipText,
              !selectedCategory && styles.categoryChipTextSelected
            ]}>Todos</Text>
          </TouchableOpacity>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryChip,
                selectedCategory === category.name && styles.categoryChipSelected
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <MaterialIcons 
                name={category.icon} 
                size={20} 
                color={selectedCategory === category.name ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category.name && styles.categoryChipTextSelected
              ]}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>      {/* Featured Products */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Productos Destacados</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>      {filteredProducts.map((product) => (
        <View key={product._id} style={styles.productCard}>
          <TouchableOpacity
            onPress={() => {
              setSelectedProduct(product);
              setShowProductModal(true);
            }}
          >
            <Image
              source={{ 
                uri: product.imageUrl || 'https://api.a0.dev/assets/image?text=elegant%20furniture%20piece&aspect=1:1'
              }}
              style={styles.productImage}
            />
          </TouchableOpacity>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>
            {/* render custom payment button HTML if provided */}
            {product.paymentScript ? (
              <WebView
                originWhitelist={['*']}
                source={{ html: product.paymentScript! }}
                style={{ height: 80, width: '100%', marginTop: 8 }}
              />
            ) : null}
            <View style={styles.productActions}>
              <TouchableOpacity 
                onPress={() => toggleFavorite(product._id)}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={favorites.includes(product._id) ? "heart" : "heart-outline"}
                  size={24}
                  color={favorites.includes(product._id) ? "#ff4b4b" : "#666"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
        </ScrollView>
      </View>

      <ProductModal
        isVisible={showProductModal}
        onClose={() => setShowProductModal(false)}
        product={selectedProduct}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#2c3e50',
  },
  categoryChipText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  favoriteButton: {
    padding: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  cartButton: {
    marginLeft: 8,
  },
  heroContainer: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroContent: {
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
  heroButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  categoriesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },  featuredSection: {
    padding: 16,
  },
  productsScroll: {
    marginTop: 8,
  },
  productCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: 'white',
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
  productImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#34495e',
    fontWeight: '500',
  },
});