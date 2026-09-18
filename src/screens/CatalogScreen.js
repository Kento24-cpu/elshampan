import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import ProductCard from "../components/ProductCard";
import { categories, products } from "../data/products";
import Header from "../components/Header";

export default function CatalogScreen({ navigation, route }) {
  const [selected, setSelected] = useState(route.params?.category || "Todos");
  const filtered = useMemo(() => selected === "Todos" ? products : products.filter((product) => product.category === selected), [selected]);
  const filters = [{ id: "0", name: "Todos" }, ...categories];

  return <View className="flex-1 bg-black"><Header title="Catálogo" subtitle={`${filtered.length} productos disponibles`} />
    <FlatList horizontal data={filters} keyExtractor={(item) => item.id} showsHorizontalScrollIndicator={false} className="mb-4 max-h-20 px-5" renderItem={({ item }) => (
      <Pressable onPress={() => setSelected(item.name)} className={`mr-2 overflow-hidden rounded-2xl border ${selected === item.name ? "border-gold-400 bg-gold-400" : "border-zinc-800 bg-zinc-900"}`}>
        {item.image && <Image source={{ uri: item.image }} resizeMode="contain" className="h-10 w-14 bg-[#171717]" />}
        <Text className={`px-3 py-2 text-xs font-black ${selected === item.name ? "text-black" : "text-zinc-400"}`}>{item.name}</Text>
      </Pressable>
    )}/>
    <FlatList data={filtered} numColumns={2} keyExtractor={(item) => item.id} columnWrapperStyle={{ justifyContent: "space-between" }} contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 100 }} renderItem={({ item }) => <ProductCard product={item} onPress={() => navigation.navigate("Producto", { product: item })} />} />
  </View>;
}
