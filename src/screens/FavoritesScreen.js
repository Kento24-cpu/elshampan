import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { productApi } from "../services/api";
import { useApp } from "../context/AppContext";

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setProducts(await productApi.list());
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const data = products.filter((product) => favorites.includes(product.id));

  if (loading) {
    return (
      <View className="flex-1 bg-black">
        <Header title="Favoritos" subtitle="Cargando..." />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E9B949" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-black">
        <Header title="Favoritos" subtitle="Sin conexión" />
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-5xl">⚠</Text>
          <Text className="mt-4 text-center text-xl font-black text-white">
            No pudimos cargar tus favoritos
          </Text>
          <Text className="mt-2 text-center text-zinc-500">{error}</Text>
          <Pressable onPress={load} className="mt-6 rounded-2xl bg-gold-400 px-8 py-4">
            <Text className="font-black text-black">REINTENTAR</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <Header
        title="Favoritos"
        subtitle={`${data.length} guardados`}
      />

      {data.length > 0 ? (
        <FlatList
          data={data}
          numColumns={2}
          keyExtractor={(item) => String(item.id)}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          contentContainerStyle={{
            paddingHorizontal: 18,
            paddingBottom: 100,
          }}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() =>
                navigation.navigate("Producto", {
                  product: item,
                  productId: item.id,
                })
              }
            />
          )}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-5xl">♡</Text>

          <Text className="mt-4 text-xl font-black text-white">
            Aún no tienes favoritos
          </Text>

          <Text className="mt-2 text-center text-zinc-500">
            Toca el corazón de cualquier producto para guardarlo.
          </Text>
        </View>
      )}
    </View>
  );
}
