import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useApp } from "../context/AppContext";

const money = (v) => `C$ ${Number(v).toLocaleString("es-NI")}`;

export default function ProductCard({ product, onPress, horizontal = false }) {
  const { addToCart, favorites, toggleFavorite } = useApp();
  const favorite = favorites.includes(product.id);

  return (
    <Pressable onPress={onPress} className={`${horizontal ? "w-64 mr-4" : "w-[48%]"} mb-4 overflow-hidden rounded-[22px] border border-zinc-800 bg-[#111111]`}>
      <View className="h-44 items-center justify-center bg-[#171717]">
        <Image source={{ uri: product.image }} resizeMode="contain" className="h-full w-full" />
        {product.badge && <View className="absolute left-3 top-3 rounded-full bg-gold-400 px-2.5 py-1"><Text className="text-[9px] font-black text-black">{product.badge}</Text></View>}
        <Pressable onPress={() => toggleFavorite(product.id)} className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-black/70">
          <Text className={`text-lg ${favorite ? "text-gold-300" : "text-zinc-400"}`}>{favorite ? "♥" : "♡"}</Text>
        </Pressable>
      </View>
      <View className="p-3.5">
        <Text className="text-[10px] font-bold uppercase tracking-widest text-gold-400">{product.category} · {product.volume}</Text>
        <Text numberOfLines={2} className="mt-1 min-h-[40px] text-sm font-extrabold leading-5 text-white">{product.name}</Text>
        <Text numberOfLines={1} className="mt-1 text-[10px] text-zinc-500">{product.brand} · {product.country}</Text>
        <View className="mt-2 flex-row items-center"><Text className="text-xs text-gold-300">★ {product.rating}</Text><Text className="ml-2 text-[10px] text-zinc-600">({product.reviews})</Text></View>
        <View className="mt-3 flex-row items-center justify-between">
          <View>
            <Text className="text-base font-black text-white">{money(product.price)}</Text>
            {product.oldPrice && <Text className="text-[10px] text-zinc-600 line-through">{money(product.oldPrice)}</Text>}
          </View>
          <Pressable onPress={() => addToCart(product)} className="h-10 w-10 items-center justify-center rounded-full bg-gold-400">
            <Text className="text-xl font-black text-black">+</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
