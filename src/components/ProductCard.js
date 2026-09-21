import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { money } from "../utils/format";

// `width` comes from the grid so the row never stretches; without it the card
// falls back to the two column layout.
export default function ProductCard({ product, onPress, horizontal = false, width }) {
  const { addToCart, favorites, toggleFavorite } = useApp();
  const { colors } = useTheme();
  const { show } = useToast();
  const favorite = favorites.includes(product.id);

  const add = () => {
    addToCart(product);
    show(`${product.name} agregado al carrito`);
  };

  const sizing = width ? "" : horizontal ? "w-64 mr-4" : "w-[48%]";

  return (
    <Pressable
      onPress={onPress}
      style={width ? { width } : undefined}
      className={`${sizing} mb-4 overflow-hidden rounded-[22px] border border-line bg-surface`}
    >
      <View className="h-44 items-center justify-center bg-elevated">
        <Image source={{ uri: product.image }} resizeMode="contain" className="h-full w-full" />
        {product.badge && <View className="absolute left-3 top-3 rounded-full bg-accent-strong px-2.5 py-1"><Text className="text-[11px] font-black text-black">{product.badge}</Text></View>}
        <Pressable onPress={() => toggleFavorite(product.id)} className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-black/70">
          <Text className={`text-lg ${favorite ? "text-accent" : "text-content"}`}>{favorite ? "♥" : "♡"}</Text>
        </Pressable>
      </View>
      <View className="p-3.5">
        <Text className="text-xs font-bold uppercase tracking-widest text-accent">{product.category} · {product.volume}</Text>
        <Text numberOfLines={2} className="mt-1 min-h-[40px] text-sm font-extrabold leading-5 text-content">{product.name}</Text>
        <Text numberOfLines={1} className="mt-1 text-xs text-muted">{product.brand} · {product.country}</Text>
        <View className="mt-2 flex-row items-center"><Text className="text-xs text-accent">★ {product.rating}</Text><Text className="ml-2 text-xs text-subtle">({product.reviews})</Text></View>
        <View className="mt-3 flex-row items-center justify-between">
          <View>
            <Text className="text-base font-black text-content">{money(product.price)}</Text>
            {product.oldPrice && <Text className="text-xs text-subtle line-through">{money(product.oldPrice)}</Text>}
          </View>
          <Pressable onPress={add} className="h-10 w-10 items-center justify-center rounded-full bg-accent-strong">
            <Text className="text-xl font-black text-black">+</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
