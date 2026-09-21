import "react-native-gesture-handler";
import "./global.css";
import React, { useMemo } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider, useApp } from "./src/context/AppContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import HomeScreen from "./src/screens/HomeScreen";
import CatalogScreen from "./src/screens/CatalogScreen";
import ProductScreen from "./src/screens/ProductScreen";
import CartScreen from "./src/screens/CartScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import OrdersScreen from "./src/screens/OrdersScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = {
  Inicio: ["home-outline", "home"],
  "Catálogo": ["grid-outline", "grid"],
  Carrito: ["cart-outline", "cart"],
  Cuenta: ["person-outline", "person"]
};

function TabIcon({ routeName, focused, color, size }) {
  const [outline, filled] = TAB_ICONS[routeName] ?? ["ellipse-outline", "ellipse"];

  return <Ionicons name={focused ? filled : outline} color={color} size={size} />;
}

function Tabs() {
  const { count } = useApp();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line, height: 70, paddingTop: 7, paddingBottom: 8 },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "800" },
        tabBarIcon: ({ focused, color, size }) => (
          <TabIcon routeName={route.name} focused={focused} color={color} size={size} />
        )
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Catálogo" component={CatalogScreen} />
      <Tab.Screen name="Carrito" component={CartScreen} options={{ tabBarBadge: count || undefined }} />
      <Tab.Screen name="Cuenta" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { colors, isDark, rootStyle } = useTheme();

  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;

    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.accent,
        background: colors.canvas,
        card: colors.surface,
        text: colors.content,
        border: colors.line,
        notification: colors.accent
      }
    };
  }, [colors, isDark]);

  return (
    <View style={[{ flex: 1, backgroundColor: colors.canvas }, rootStyle]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.content,
            headerTitleStyle: { fontWeight: "900" },
            contentStyle: { backgroundColor: colors.canvas }
          }}
        >
          <Stack.Screen name="Principal" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="Producto" component={ProductScreen} options={{ title: "Detalle" }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Finalizar compra" }} />
          <Stack.Screen name="Favoritos" component={FavoritesScreen} options={{ title: "Favoritos" }} />
          <Stack.Screen name="Pedidos" component={OrdersScreen} options={{ title: "Mis pedidos" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <AppNavigator />
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
