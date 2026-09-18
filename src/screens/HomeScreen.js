import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ProductCard from "../components/ProductCard";
import { categories, products } from "../data/products";
import { useApp } from "../context/AppContext";

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const { count, favorites } = useApp();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? products.filter(p => `${p.name} ${p.category} ${p.brand || ""} ${p.country || ""}`.toLowerCase().includes(q)) : products;
  }, [query]);

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={results}
        numColumns={2}
        keyExtractor={x => x.id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 100 }}
        ListHeaderComponent={
          <View>
            <View className="mt-2 mb-5 flex-row items-center justify-between">
              <View>
                <Text className="text-3xl font-black text-white">El <Text className="text-gold-300">Shampan.</Text></Text>
                <Text className="mt-1 text-xs font-medium text-zinc-500">Selección premium · Licores sellados</Text>
              </View>
              <View className="flex-row">
                <Pressable onPress={() => navigation.navigate("Favoritos")} className="mr-2 h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900"><Text className="text-lg text-gold-300">♡</Text>{favorites.length > 0 && <View className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1"><Text className="text-[9px] font-black text-black">{favorites.length}</Text></View>}</Pressable>
                <Pressable onPress={() => navigation.navigate("Carrito")} className="h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900"><Text className="text-base font-black text-gold-300">C</Text>{count > 0 && <View className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1"><Text className="text-[9px] font-black text-black">{count}</Text></View>}</Pressable>
              </View>
            </View>

            <LinearGradient colors={["#3a2a0b", "#17130b", "#0d0d0d"]} className="mb-5 overflow-hidden rounded-[28px] border border-gold-600/30 p-6">
              <Text className="text-[10px] font-black uppercase tracking-[3px] text-gold-300">Selección de la semana</Text>
              <Text className="mt-3 text-3xl font-black leading-9 text-white">El buen gusto</Text>
              <Text className="text-3xl font-black leading-9 text-gold-300">empieza aquí.</Text>
              <Text className="mt-3 max-w-[270px] text-sm leading-5 text-zinc-400">Productos sellados y seleccionados para momentos especiales.</Text>
              <Pressable onPress={() => navigation.navigate("Catálogo")} className="mt-5 self-start rounded-xl bg-gold-400 px-5 py-3"><Text className="text-xs font-black text-black">EXPLORAR COLECCIÓN</Text></Pressable>
            </LinearGradient>

            <View className="mb-6 flex-row items-center rounded-2xl border border-zinc-800 bg-[#111111] px-4">
              <Text className="mr-2 text-xl text-zinc-500">⌕</Text>
              <TextInput value={query} onChangeText={setQuery} placeholder="¿Qué estás buscando?" placeholderTextColor="#666" className="flex-1 py-3.5 text-sm text-white" />
            </View>

            <Text className="mb-3 text-lg font-black text-white">Explora por categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-7">
              {categories.map(c => <Pressable key={c.id} onPress={() => navigation.navigate("Catálogo", { category: c.name })} className="mr-3 w-[104px] overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]"><Image source={{ uri: c.image }} resizeMode="contain" className="h-20 w-full bg-[#171717]"/><Text className="px-2 py-3 text-center text-[11px] font-bold text-zinc-300">{c.name}</Text></Pressable>)}
            </ScrollView>

            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-black text-white">{query ? "Resultados" : "Selección destacada"}</Text>
              {!query && <Pressable onPress={() => navigation.navigate("Catálogo")}><Text className="text-xs font-bold text-gold-300">VER TODO →</Text></Pressable>}
            </View>
          </View>
        }
        renderItem={({ item }) => <ProductCard product={item} onPress={() => navigation.navigate("Producto", { product: item })} />}
      />
    </View>
  );
}