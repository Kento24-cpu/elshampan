import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import HomeScreen from "../screens/HomeScreen";
import CatalogScreen from "../screens/CatalogScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

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

// `compact` hides the bar on wide screens, where the sidebar takes over.
export default function Tabs({ compact = false }) {
  const { count } = useApp();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: compact
          ? { display: "none" }
          : { backgroundColor: colors.surface, borderTopColor: colors.line, height: 70, paddingTop: 7, paddingBottom: 8 },
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
