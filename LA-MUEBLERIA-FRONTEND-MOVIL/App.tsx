import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from './components/ui/toast-provider';
import { AuthProvider } from './components/ui/auth-context';
import ShopScreen from "./screens/ShopScreen"
import LoginScreen from "./screens/LoginScreen"
import HomeScreen from "./screens/HomeScreen"
import ProductScreen from "./screens/ProductScreen"
import MaterialScreen from "./screens/MaterialScreen"

// Ignorar advertencias específicas si es necesario
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

const Stack = createNativeStackNavigator();

function RootStack() {
  return (    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'white' }
      }}
    >
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="AdminHome" component={HomeScreen} />
      <Stack.Screen name="Products" component={ProductScreen} />
      <Stack.Screen name="Materials" component={MaterialScreen} />
    </Stack.Navigator>
  );
}
  
export default function App() {
  return (    <SafeAreaProvider style={styles.container}>
    <AuthProvider>
      <ToastProvider>
        <NavigationContainer>
          <RootStack />      </NavigationContainer>
      </ToastProvider>
    </AuthProvider>
  </SafeAreaProvider>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
