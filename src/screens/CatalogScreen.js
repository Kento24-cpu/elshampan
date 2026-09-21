import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from "react-native";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import { categoryApi, productApi } from "../services/api";

export default function CatalogScreen({ navigation, route }) {
  const [selected, setSelected] = useState(route.params?.category || "Todos");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (route.params?.category) setSelected(route.params.category);
  }, [route.params?.category]);

  const filters = useMemo(() => [{ id: "0", name: "Todos" }, ...categories], [categories]);
  const filtered = useMemo(() => selected === "Todos" ? products : products.filter((product) => product.category === selected), [products, selected]);

  if (loading) {
    return <View className="flex-1 bg-black"><Header title="Catálogo" subtitle="Cargando productos..." /><View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#E9B949" /></View></View>;
  }

  if (error) {
    return <View className="flex-1 bg-black"><Header title="Catálogo" subtitle="Sin conexión" /><View className="flex-1 items-center justify-center px-8"><Text className="text-5xl">⚠</Text><Text className="mt-4 text-center text-xl font-black text-white">No pudimos cargar el catálogo</Text><Text className="mt-2 text-center text-zinc-500">{error}</Text><Pressable onPress={load} className="mt-6 rounded-2xl bg-gold-400 px-8 py-4"><Text className="font-black text-black">REINTENTAR</Text></Pressable></View></View>;
  }

  return <View className="flex-1 bg-black"><Header title="Catálogo" subtitle={`${filtered.length} productos disponibles`} />
    <FlatList horizontal data={filters} keyExtractor={(item) => item.id} showsHorizontalScrollIndicator={false} className="mb-4 max-h-20 px-5" renderItem={({ item }) => (
      <Pressable onPress={() => setSelected(item.name)} className={`mr-2 overflow-hidden rounded-2xl border ${selected === item.name ? "border-gold-400 bg-gold-400" : "border-zinc-800 bg-zinc-900"}`}>
        {item.image && <Image source={{ uri: item.image }} resizeMode="contain" className="h-10 w-14 bg-[#171717]" />}
        <Text className={`px-3 py-2 text-xs font-black ${selected === item.name ? "text-black" : "text-zinc-400"}`}>{item.name}</Text>
      </Pressable>
    )}/>
    <FlatList data={filtered} numColumns={2} keyExtractor={(item) => item.id} columnWrapperStyle={{ justifyContent: "space-between" }} contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 100 }} ListEmptyComponent={<View className="items-center px-8 py-16"><Text className="text-xl font-black text-white">Sin productos en {selected}</Text></View>} renderItem={({ item }) => <ProductCard product={item} onPress={() => navigation.navigate("Producto", { product: item, productId: item.id })} />} />
  </View>;
}
