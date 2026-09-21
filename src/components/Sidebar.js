import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigationState } from "@react-navigation/native";
import { useApp } from "../context/AppContext";
import { THEME_OPTIONS, useTheme } from "../context/ThemeContext";
import { SIDEBAR_WIDTH } from "../hooks/useResponsive";
import { useSectionNavigation } from "../hooks/useSectionNavigation";

const NAV_ITEMS = [
  { route: "Inicio", label: "Inicio", icon: "home" },
  { route: "Catálogo", label: "Catálogo", icon: "grid" },
  { route: "Carrito", label: "Carrito", icon: "cart", badge: "cart" },
  { route: "Favoritos", label: "Favoritos", icon: "heart", badge: "favorites" },
  { route: "Cuenta", label: "Cuenta", icon: "person" }
];

// Reads the tab nested inside "Principal", or the stack screen on top when the
// user is somewhere else (Favoritos, Pedidos).
const selectActiveRoute = (state) => {
  const current = state.routes[state.index];
  const nested = current?.state;

  if (!nested?.routes) return current?.name;

  return nested.routes[nested.index ?? 0]?.name ?? current.name;
};

export default function Sidebar() {
  const goTo = useSectionNavigation();
  const activeRoute = useNavigationState(selectActiveRoute);
  const { count, favorites, user, logout } = useApp();
  const { colors, preference, setPreference } = useTheme();

  const badgeFor = (key) => (key === "cart" ? count : key === "favorites" ? favorites.length : 0);

  return (
    <View style={{ width: SIDEBAR_WIDTH }} className="h-full border-r border-line bg-surface">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingVertical: 24, paddingHorizontal: 16 }}>
        <View className="mb-8 px-2">
          <Text className="text-2xl font-black text-content">
            El <Text className="text-accent">Shampán</Text>
          </Text>
          <Text className="mt-1 text-[11px] font-medium text-muted">Selección premium · Licores sellados</Text>
        </View>

        <View className="gap-1">
          {NAV_ITEMS.map((item) => {
            const active = activeRoute === item.route;
            const badge = item.badge ? badgeFor(item.badge) : 0;

            return (
              <Pressable
                key={item.route}
                onPress={() => goTo(item.route)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: active }}
                className={`flex-row items-center rounded-xl px-3 py-3 ${active ? "bg-tint" : ""}`}
              >
                <View className={`absolute left-0 h-6 w-1 rounded-r-full ${active ? "bg-accent-strong" : "bg-transparent"}`} />
                <Ionicons
                  name={active ? item.icon : `${item.icon}-outline`}
                  size={20}
                  color={active ? colors.accent : colors.muted}
                />
                <Text className={`ml-3 flex-1 font-bold ${active ? "text-accent" : "text-content"}`}>
                  {item.label}
                </Text>
                {badge > 0 && (
                  <View className="min-w-6 items-center rounded-full bg-accent-strong px-2 py-0.5">
                    <Text className="text-[10px] font-black text-black">{badge}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <View className="mt-8 mb-3 border-t border-line pt-6">
          <Text className="mb-3 px-2 text-[10px] font-black uppercase tracking-widest text-subtle">Tema</Text>
          <View className="flex-row gap-1">
            {THEME_OPTIONS.map((option) => {
              const active = preference === option.value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => setPreference(option.value)}
                  accessibilityRole="button"
                  accessibilityLabel={`Tema ${option.label}`}
                  accessibilityState={{ selected: active }}
                  className={`flex-1 items-center rounded-xl border py-2.5 ${active ? "border-accent-strong bg-tint" : "border-line"}`}
                >
                  <Ionicons
                    name={option.icon}
                    size={16}
                    color={active ? colors.accent : colors.muted}
                  />
                  <Text className={`mt-1 text-[10px] font-bold ${active ? "text-accent" : "text-muted"}`}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="flex-1" />

        <View className="mt-6 border-t border-line pt-5">
          {user ? (
            <View>
              <Text numberOfLines={1} className="px-2 font-black text-content">{user.name}</Text>
              <Text numberOfLines={1} className="mt-0.5 px-2 text-[11px] text-muted">{user.email}</Text>
              <Pressable
                onPress={logout}
                accessibilityRole="button"
                accessibilityLabel="Cerrar sesión"
                className="mt-4 flex-row items-center justify-center rounded-xl border border-line py-3"
              >
                <Ionicons name="log-out-outline" size={18} color={colors.muted} />
                <Text className="ml-2 text-xs font-bold text-muted">Cerrar sesión</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => goTo("Cuenta")}
              accessibilityRole="button"
              accessibilityLabel="Iniciar sesión"
              className="items-center rounded-xl bg-accent-strong py-3"
            >
              <Text className="text-xs font-black text-black">INICIAR SESIÓN</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
