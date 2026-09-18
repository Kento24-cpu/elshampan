import React from "react";
import { FlatList, Text, View } from "react-native";

import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { useApp } from "../context/AppContext";

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useApp();

  const data = products.filter((product) =>
    favorites.includes(product.id)
  );

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