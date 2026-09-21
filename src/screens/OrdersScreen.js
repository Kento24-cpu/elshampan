import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import Header from "../components/Header";
import { orderApi } from "../services/api";
import { useApp } from "../context/AppContext";

const money = v => `C$ ${Number(v).toLocaleString("es-NI")}`;
const statusLabel = v => v ? v.charAt(0).toUpperCase() + v.slice(1) : v;

export default function OrdersScreen({ navigation }) {
  const { token, orders, setOrders } = useApp();
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setError(null);

    try {
      setOrders(await orderApi.list(token));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [token, setOrders]);

  useEffect(() => {
    load();
  }, [load]);

  if (!token) {
    return <View className="flex-1 bg-black"><Header title="Mis pedidos" subtitle="Historial de compras"/><View className="flex-1 items-center justify-center px-8"><Text className="text-5xl">▱</Text><Text className="mt-4 text-xl font-black text-white">Inicia sesión para ver tus pedidos</Text><Text className="mt-2 text-center text-zinc-500">Tu historial se guarda en tu cuenta de El Shampan.</Text><Pressable onPress={() => navigation.navigate("Cuenta")} className="mt-6 rounded-2xl bg-gold-400 px-8 py-4"><Text className="font-black text-black">IR A MI CUENTA</Text></Pressable></View></View>;
  }

  if (loading) {
    return <View className="flex-1 bg-black"><Header title="Mis pedidos" subtitle="Cargando..." /><View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#E9B949" /></View></View>;
  }

  if (error) {
    return <View className="flex-1 bg-black"><Header title="Mis pedidos" subtitle="Sin conexión" /><View className="flex-1 items-center justify-center px-8"><Text className="text-5xl">⚠</Text><Text className="mt-4 text-center text-xl font-black text-white">No pudimos cargar tus pedidos</Text><Text className="mt-2 text-center text-zinc-500">{error}</Text><Pressable onPress={load} className="mt-6 rounded-2xl bg-gold-400 px-8 py-4"><Text className="font-black text-black">REINTENTAR</Text></Pressable></View></View>;
  }

  return <View className="flex-1 bg-black"><Header title="Mis pedidos" subtitle="Historial de compras"/>{orders.length?<FlatList data={orders} keyExtractor={x=>x.id} contentContainerStyle={{paddingHorizontal:18, paddingBottom:60}} refreshControl={<RefreshControl refreshing={false} onRefresh={load} tintColor="#E9B949" />} renderItem={({item})=><View className="mb-3 rounded-2xl border border-zinc-800 bg-[#111111] p-5"><View className="flex-row justify-between"><Text className="font-black text-white">#{item.code}</Text><Text className="rounded-full bg-gold-400/10 px-2 py-1 text-[10px] font-bold text-gold-300">{statusLabel(item.status)}</Text></View><Text className="mt-2 text-xs text-zinc-600">{item.date}</Text><Text className="mt-3 text-xs text-zinc-500">{item.items.length} producto(s) · {item.address}</Text><Text className="mt-3 text-xl font-black text-white">{money(item.total)}</Text></View>}/>:<View className="flex-1 items-center justify-center px-8"><Text className="text-5xl">▱</Text><Text className="mt-4 text-xl font-black text-white">Sin pedidos todavía</Text><Text className="mt-2 text-center text-zinc-500">Tus compras aparecerán aquí.</Text></View>}</View>;
}
