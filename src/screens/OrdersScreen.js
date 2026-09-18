import React from "react";
import { FlatList, Text, View } from "react-native";
import Header from "../components/Header";
import { useApp } from "../context/AppContext";

const money=v=>`C$ ${Number(v).toLocaleString("es-NI")}`;

export default function OrdersScreen() {
  const {orders}=useApp();
  return <View className="flex-1 bg-black"><Header title="Mis pedidos" subtitle="Historial de compras"/>{orders.length?<FlatList data={orders} keyExtractor={x=>x.id} contentContainerStyle={{paddingHorizontal:18}} renderItem={({item})=><View className="mb-3 rounded-2xl border border-zinc-800 bg-[#111111] p-5"><View className="flex-row justify-between"><Text className="font-black text-white">#{item.id}</Text><Text className="rounded-full bg-gold-400/10 px-2 py-1 text-[10px] font-bold text-gold-300">{item.status}</Text></View><Text className="mt-2 text-xs text-zinc-600">{item.date}</Text><Text className="mt-4 text-xl font-black text-white">{money(item.total)}</Text></View>}/>:<View className="flex-1 items-center justify-center px-8"><Text className="text-5xl">▱</Text><Text className="mt-4 text-xl font-black text-white">Sin pedidos todavía</Text><Text className="mt-2 text-center text-zinc-500">Tus compras aparecerán aquí.</Text></View>}</View>;
}