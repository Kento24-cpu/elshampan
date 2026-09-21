import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { productApi } from "../services/api";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

const money = v => `C$ ${Number(v).toLocaleString("es-NI")}`;

export default function ProductScreen({ route, navigation }) {
  const { product: initialProduct, productId } = route.params;
  const [product, setProduct] = useState(initialProduct ?? null);
  const [error, setError] = useState(null);
  const { addToCart, favorites, toggleFavorite } = useApp();
  const { colors } = useTheme();

  const id = productId ?? initialProduct?.id;

  const load = useCallback(async () => {
    if (!id) return;

    setError(null);

    try {
      setProduct(await productApi.byId(id));
    } catch (loadError) {
      setError(loadError.message);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas px-8">
        {error ? (
          <>
            <Text className="text-5xl">⚠</Text>
            <Text className="mt-4 text-center text-xl font-black text-content">No pudimos cargar el producto</Text>
            <Text className="mt-2 text-center text-muted">{error}</Text>
            <Pressable onPress={load} className="mt-6 rounded-2xl bg-accent-strong px-8 py-4"><Text className="font-black text-black">REINTENTAR</Text></Pressable>
          </>
        ) : (
          <ActivityIndicator size="large" color={colors.accent} />
        )}
      </View>
    );
  }

  const favorite = favorites.includes(product.id);

  const add = () => {
    addToCart(product);
    Alert.alert("Producto agregado", "Se agregó correctamente a tu carrito.");
  };

  return <View className="flex-1 bg-canvas">
    <ScrollView contentContainerStyle={{paddingBottom:130}}>
      <View className="h-80 items-center justify-center bg-elevated">
        <Image source={{ uri: product.image }} resizeMode="contain" className="h-full w-full" />
        <Pressable onPress={()=>toggleFavorite(product.id)} className="absolute right-5 top-5 h-12 w-12 items-center justify-center rounded-full bg-black/70"><Text className="text-2xl text-accent">{favorite?"♥":"♡"}</Text></Pressable>
        {product.badge && <View className="absolute left-5 top-5 rounded-full bg-accent-strong px-3 py-2"><Text className="text-[10px] font-black text-black">{product.badge}</Text></View>}
      </View>
      <View className="px-5 pt-6">
        <Text className="text-[10px] font-black uppercase tracking-[3px] text-accent">{product.category} · {product.volume}</Text>
        <Text className="mt-2 text-3xl font-black leading-9 text-content">{product.name}</Text>
        <View className="mt-3 flex-row items-center"><Text className="font-bold text-accent">★ {product.rating}</Text><Text className="ml-2 text-xs text-subtle">{product.reviews} reseñas</Text></View>
        <View className="mt-4 flex-row items-end"><Text className="text-3xl font-black text-content">{money(product.price)}</Text>{product.oldPrice&&<Text className="mb-1 ml-3 text-sm text-subtle line-through">{money(product.oldPrice)}</Text>}</View>
        <View className="my-6 h-px bg-line"/>
        <Text className="text-lg font-black text-content">Descripción</Text>
        <Text className="mt-2 text-base leading-6 text-muted">{product.description}</Text>
        <View className="mt-6 rounded-2xl border border-line bg-surface p-4">
          <Text className="font-bold text-content">✓ Producto sellado y original</Text>
          <Text className="mt-1 text-xs text-muted">Stock disponible: {product.stock} unidades</Text>
        </View>
      </View>
    </ScrollView>
    <View className="absolute bottom-0 left-0 right-0 border-t border-line bg-canvas p-4">
      <Pressable onPress={add} disabled={product.stock < 1} className={`rounded-2xl py-4 items-center ${product.stock < 1 ? "bg-elevated" : "bg-accent-strong"}`}><Text className={`font-black ${product.stock < 1 ? "text-muted" : "text-black"}`}>{product.stock < 1 ? "AGOTADO" : `AGREGAR AL CARRITO · ${money(product.price)}`}</Text></Pressable>
    </View>
  </View>;
}
