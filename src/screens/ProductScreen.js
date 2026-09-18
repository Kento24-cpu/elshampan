import React from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useApp } from "../context/AppContext";

const money = v => `C$ ${v.toLocaleString("es-NI")}`;

export default function ProductScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart, favorites, toggleFavorite } = useApp();
  const favorite = favorites.includes(product.id);

  const add = () => {
    addToCart(product);
    Alert.alert("Producto agregado", "Se agregó correctamente a tu carrito.");
  };

  return <View className="flex-1 bg-black">
    <ScrollView contentContainerStyle={{paddingBottom:130}}>
      <View className="h-80 items-center justify-center bg-[#151515]">
        <Image source={{ uri: product.image }} resizeMode="contain" className="h-full w-full" />
        <Pressable onPress={()=>toggleFavorite(product.id)} className="absolute right-5 top-5 h-12 w-12 items-center justify-center rounded-full bg-black/70"><Text className="text-2xl text-gold-300">{favorite?"♥":"♡"}</Text></Pressable>
        {product.badge && <View className="absolute left-5 top-5 rounded-full bg-gold-400 px-3 py-2"><Text className="text-[10px] font-black text-black">{product.badge}</Text></View>}
      </View>
      <View className="px-5 pt-6">
        <Text className="text-[10px] font-black uppercase tracking-[3px] text-gold-400">{product.category} · {product.volume}</Text>
        <Text className="mt-2 text-3xl font-black leading-9 text-white">{product.name}</Text>
        <View className="mt-3 flex-row items-center"><Text className="font-bold text-gold-300">★ {product.rating}</Text><Text className="ml-2 text-xs text-zinc-600">{product.reviews} reseñas</Text></View>
        <View className="mt-4 flex-row items-end"><Text className="text-3xl font-black text-white">{money(product.price)}</Text>{product.oldPrice&&<Text className="mb-1 ml-3 text-sm text-zinc-600 line-through">{money(product.oldPrice)}</Text>}</View>
        <View className="my-6 h-px bg-zinc-800"/>
        <Text className="text-lg font-black text-white">Descripción</Text>
        <Text className="mt-2 text-base leading-6 text-zinc-400">{product.description}</Text>
        <View className="mt-6 rounded-2xl border border-zinc-800 bg-[#111111] p-4">
          <Text className="font-bold text-white">✓ Producto sellado y original</Text>
          <Text className="mt-1 text-xs text-zinc-500">Stock disponible: {product.stock} unidades</Text>
        </View>
      </View>
    </ScrollView>
    <View className="absolute bottom-0 left-0 right-0 border-t border-zinc-800 bg-black/95 p-4">
      <Pressable onPress={add} className="rounded-2xl bg-gold-400 py-4 items-center"><Text className="font-black text-black">AGREGAR AL CARRITO · {money(product.price)}</Text></Pressable>
    </View>
  </View>;
}