import "react-native-gesture-handler";
import "./global.css";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { AppProvider, useApp } from "./src/context/AppContext";
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

function Tabs() {
  const { count } = useApp();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#090909", borderTopColor: "#242424", height: 70, paddingTop: 7, paddingBottom: 8 },
        tabBarActiveTintColor: "#E9B949",
        tabBarInactiveTintColor: "#686868",
        tabBarLabelStyle: { fontSize: 10, fontWeight: "800" },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Catálogo"
        component={CatalogScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Carrito"
        component={CartScreen}
        options={{
          tabBarBadge: count || undefined,
          tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Cuenta"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, primary: "#E9B949", background: "#000", card: "#090909", text: "#fff", border: "#242424" } }}>
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#090909" }, headerTintColor: "#fff", headerTitleStyle: { fontWeight: "900" }, contentStyle: { backgroundColor: "#000" } }}>
          <Stack.Screen name="Principal" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="Producto" component={ProductScreen} options={{ title: "Detalle" }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Finalizar compra" }} />
          <Stack.Screen name="Favoritos" component={FavoritesScreen} options={{ title: "Favoritos" }} />
          <Stack.Screen name="Pedidos" component={OrdersScreen} options={{ title: "Mis pedidos" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
