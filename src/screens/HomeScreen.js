import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ProductCard from "../components/ProductCard";
import { categoryApi, productApi } from "../services/api";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { count, favorites } = useApp();
  const { colors, gradient } = useTheme();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [productList, categoryList] = await Promise.all([
        productApi.list(),
        categoryApi.list()
      ]);

      setProducts(productList);
      setCategories(categoryList);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? products.filter(p => `${p.name} ${p.category} ${p.brand || ""} ${p.country || ""}`.toLowerCase().includes(q)) : products;
  }, [query, products]);

  if (loading) {
    return <View className="flex-1 items-center justify-center bg-canvas"><ActivityIndicator size="large" color={colors.accent} /><Text className="mt-4 text-sm text-muted">Cargando catálogo...</Text></View>;
  }

  if (error) {
    return <View className="flex-1 items-center justify-center bg-canvas px-8"><Text className="text-5xl">⚠</Text><Text className="mt-4 text-center text-xl font-black text-content">No pudimos cargar el catálogo</Text><Text className="mt-2 text-center text-muted">{error}</Text><Text className="mt-2 text-center text-xs text-subtle">Verifica que la API esté encendida y que EXPO_PUBLIC_API_URL apunte a tu PC.</Text><Pressable onPress={load} className="mt-6 rounded-2xl bg-accent-strong px-8 py-4"><Text className="font-black text-black">REINTENTAR</Text></Pressable></View>;
  }

  return (
    <View className="flex-1 bg-canvas">
      <FlatList
        data={results}
        numColumns={2}
        keyExtractor={x => x.id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 100 }}
        ListEmptyComponent={<View className="items-center px-8 py-16"><Text className="text-5xl">⌕</Text><Text className="mt-4 text-xl font-black text-content">Sin resultados</Text><Text className="mt-2 text-center text-muted">No encontramos productos para “{query}”.</Text></View>}
        ListHeaderComponent={
          <View>
            <View className="mt-2 mb-5 flex-row items-center justify-between">
              <View>
                <Text className="text-3xl font-black text-content">El <Text className="text-accent">Shampan.</Text></Text>
                <Text className="mt-1 text-xs font-medium text-muted">Selección premium · Licores sellados</Text>
              </View>
              <View className="flex-row">
                <Pressable onPress={() => navigation.navigate("Favoritos")} className="mr-2 h-11 w-11 items-center justify-center rounded-full border border-line bg-surface"><Text className="text-lg text-accent">♡</Text>{favorites.length > 0 && <View className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full bg-accent-strong px-1"><Text className="text-[9px] font-black text-black">{favorites.length}</Text></View>}</Pressable>
                <Pressable onPress={() => navigation.navigate("Carrito")} className="h-11 w-11 items-center justify-center rounded-full border border-line bg-surface"><Text className="text-base font-black text-accent">C</Text>{count > 0 && <View className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full bg-accent-strong px-1"><Text className="text-[9px] font-black text-black">{count}</Text></View>}</Pressable>
              </View>
            </View>

            <LinearGradient colors={gradient} className="mb-5 overflow-hidden rounded-[28px] border border-gold-600/30 p-6">
              <Text className="text-[10px] font-black uppercase tracking-[3px] text-accent">Selección de la semana</Text>
              <Text className="mt-3 text-3xl font-black leading-9 text-content">El buen gusto</Text>
              <Text className="text-3xl font-black leading-9 text-accent">empieza aquí.</Text>
              <Text className="mt-3 max-w-[270px] text-sm leading-5 text-muted">Productos sellados y seleccionados para momentos especiales.</Text>
              <Pressable onPress={() => navigation.navigate("Catálogo")} className="mt-5 self-start rounded-xl bg-accent-strong px-5 py-3"><Text className="text-xs font-black text-black">EXPLORAR COLECCIÓN</Text></Pressable>
            </LinearGradient>

            <View className="mb-6 flex-row items-center rounded-2xl border border-line bg-surface px-4">
              <Text className="mr-2 text-xl text-muted">⌕</Text>
              <TextInput value={query} onChangeText={setQuery} placeholder="¿Qué estás buscando?" placeholderTextColor={colors.placeholder} className="flex-1 py-3.5 text-sm text-content" />
            </View>

            <Text className="mb-3 text-lg font-black text-content">Explora por categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-7">
              {categories.map(c => <Pressable key={c.id} onPress={() => navigation.navigate("Catálogo", { category: c.name })} className="mr-3 w-[104px] overflow-hidden rounded-2xl border border-line bg-surface"><Image source={{ uri: c.image }} resizeMode="contain" className="h-20 w-full bg-elevated"/><Text className="px-2 py-3 text-center text-[11px] font-bold text-content">{c.name}</Text></Pressable>)}
            </ScrollView>

            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-black text-content">{query ? "Resultados" : "Selección destacada"}</Text>
              {!query && <Pressable onPress={() => navigation.navigate("Catálogo")}><Text className="text-xs font-bold text-accent">VER TODO →</Text></Pressable>}
            </View>
          </View>
        }
        renderItem={({ item }) => <ProductCard product={item} onPress={() => navigation.navigate("Producto", { product: item, productId: item.id })} />}
      />
    </View>
  );
}
