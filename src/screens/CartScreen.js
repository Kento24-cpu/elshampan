import React from "react";
import { Image, Pressable, Text, View, FlatList } from "react-native";
import Header from "../components/Header";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

export default function CartScreen({ navigation }) {
  const { cart, updateQuantity, removeFromCart } = useApp();
  const { colors } = useTheme();
  const money = (value) => `C$ ${Number(value).toLocaleString("es-NI")}`;
  const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

  if (cart.length === 0) {
    return <View className="flex-1 bg-canvas"><Header title="Mi carrito" subtitle="Tu carrito está vacío" /><View className="flex-1 items-center justify-center px-8"><View className="mb-4 h-20 w-20 items-center justify-center rounded-full border border-line bg-surface"><Text className="text-2xl font-black text-muted">0</Text></View><Text className="mb-2 text-center text-2xl font-black text-content">Carrito vacío</Text><Text className="mb-6 text-center text-muted">Agrega algunos productos para comenzar tu compra.</Text><Pressable onPress={() => navigation.navigate("Catálogo")} className="rounded-2xl bg-accent-strong px-8 py-4"><Text className="font-black text-black">VER PRODUCTOS</Text></Pressable></View></View>;
  }

  return <View className="flex-1 bg-canvas">
    <Header title="Mi carrito" subtitle={`${cart.length} producto(s)`}/>
    <FlatList data={cart} keyExtractor={(item) => String(item.id)} contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 150 }} renderItem={({ item }) => (
      <View className="mb-3 rounded-2xl border border-line bg-surface p-4">
        <View className="flex-row">
          <View className="h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-elevated"><Image source={{ uri: item.image }} resizeMode="contain" className="h-full w-full" /></View>
          <View className="ml-3 flex-1"><Text numberOfLines={2} className="font-black text-content">{item.name}</Text><Text className="mt-1 text-xs text-muted">{item.brand} · {item.volume}</Text><Text className="mt-1 text-sm text-accent">{money(item.price)}</Text><View className="mt-3 flex-row items-center"><Pressable onPress={() => updateQuantity(item.id, Math.max(1, Number(item.quantity) - 1))} className="h-9 w-9 items-center justify-center rounded-full bg-elevated"><Text className="text-lg font-black text-content">−</Text></Pressable><Text className="mx-4 font-black text-content">{item.quantity}</Text><Pressable onPress={() => updateQuantity(item.id, Number(item.quantity) + 1)} className="h-9 w-9 items-center justify-center rounded-full bg-accent-strong"><Text className="text-lg font-black text-black">+</Text></Pressable></View></View>
          <Pressable onPress={() => removeFromCart(item.id)} className="ml-2 h-9 w-9 items-center justify-center rounded-full bg-elevated"><Text className="text-sm font-black text-danger">X</Text></Pressable>
        </View>
        <View className="mt-4 border-t border-line pt-3"><View className="flex-row justify-between"><Text className="text-muted">Subtotal</Text><Text className="font-black text-content">{money(Number(item.price) * Number(item.quantity))}</Text></View></View>
      </View>
    )}/>
    <View className="absolute bottom-0 left-0 right-0 border-t border-line bg-canvas px-5 py-4"><View className="mb-3 flex-row items-center justify-between"><Text className="text-muted">Total</Text><Text className="text-2xl font-black text-content">{money(total)}</Text></View><Pressable onPress={() => navigation.navigate("Checkout")} className="items-center rounded-2xl bg-accent-strong py-4"><Text className="font-black text-black">CONTINUAR COMPRA</Text></Pressable></View>
  </View>;
}
