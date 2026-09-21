import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";

// The tab navigator is nested inside the "Principal" stack screen, so a component
// rendered at stack level (the sidebar) or on a stack screen cannot reach those
// routes by name: React Navigation resolves navigate() upwards, never downwards.
// Naming the parent route plus the nested screen is what actually works.
const TAB_SECTIONS = ["Inicio", "Catálogo", "Carrito", "Cuenta"];

export function useSectionNavigation() {
  const navigation = useNavigation();

  return useCallback((destination, params) => {
    if (TAB_SECTIONS.includes(destination)) {
      navigation.navigate("Principal", { screen: destination, params });
      return;
    }

    navigation.navigate(destination, params);
  }, [navigation]);
}
