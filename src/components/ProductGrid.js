import React from "react";
import { FlatList } from "react-native";
import ProductCard from "./ProductCard";
import { GRID_GAP, GRID_PADDING, useProductGrid } from "../hooks/useResponsive";

// Keeps the three catalogue grids identical: the column count follows the
// available width and every card gets an explicit width, so the last row never
// stretches and no filler cells are needed.
export default function ProductGrid({ data, onPressProduct, ...listProps }) {
  const { columns, itemWidth } = useProductGrid();

  return (
    <FlatList
      {...listProps}
      // Changing numColumns requires a remount, so the count is part of the key.
      key={`product-grid-${columns}`}
      data={data}
      numColumns={columns}
      keyExtractor={(item) => String(item.id)}
      columnWrapperStyle={{ gap: GRID_GAP }}
      contentContainerStyle={{ paddingHorizontal: GRID_PADDING, paddingBottom: 100 }}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          width={itemWidth}
          onPress={() => onPressProduct(item)}
        />
      )}
    />
  );
}
