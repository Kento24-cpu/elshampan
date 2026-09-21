import "react-native-gesture-handler";
import "./global.css";
import React, { useMemo } from "react";
import { View } from "react-native";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "./src/context/AppContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { ToastProvider } from "./src/context/ToastContext";
import ResponsiveShell from "./src/navigation/ResponsiveShell";
import ProductScreen from "./src/screens/ProductScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import OrdersScreen from "./src/screens/OrdersScreen";

const Stack = createNativeStackNavigator();

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
          <Stack.Screen name="Principal" component={ResponsiveShell} options={{ headerShown: false }} />
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
        <ToastProvider>
          <AppProvider>
            <AppNavigator />
          </AppProvider>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
