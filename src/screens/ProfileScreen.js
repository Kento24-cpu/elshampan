import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useApp } from "../context/AppContext";

export default function ProfileScreen({navigation}) {
  const {favorites,orders}=useApp();
  const item=(label,value,action)=> <Pressable onPress={action} className="flex-row items-center justify-between border-b border-zinc-800 px-5 py-5"><View><Text className="font-bold text-white">{label}</Text>{value&&<Text className="mt-1 text-[10px] text-zinc-600">{value}</Text>}</View><Text className="text-xl text-zinc-600">›</Text></Pressable>;

  return <ScrollView className="flex-1 bg-black px-5 pt-6" contentContainerStyle={{paddingBottom:40}}>
    <View className="items-center"><View className="h-24 w-24 items-center justify-center rounded-full border border-gold-500 bg-[#211a0b]"><Text className="text-5xl">♙</Text></View><Text className="mt-4 text-2xl font-black text-white">Mi cuenta</Text><Text className="mt-1 text-xs text-zinc-500">Gestiona tu experiencia en El Shampan</Text></View>
    <View className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111]">
      {item("Mis pedidos",`${orders.length} pedido(s)`,()=>navigation.navigate("Pedidos"))}
      {item("Favoritos",`${favorites.length} producto(s)`,()=>navigation.navigate("Favoritos"))}
      {item("Datos personales","Nombre, teléfono y cuenta",()=>Alert.alert("Datos personales","Esta sección está preparada para conectarse al perfil del backend."))}
      {item("Direcciones","Gestiona tus direcciones",()=>Alert.alert("Direcciones","Esta sección está preparada para conectarse al backend."))}
      {item("Ayuda y soporte","Estamos para ayudarte",()=>Alert.alert("Soporte","Contáctanos desde el canal de soporte configurado por el equipo."))}
    </View>
    <View className="mt-5 rounded-2xl border border-gold-600/20 bg-[#17120a] p-5"><Text className="font-black text-gold-300">EL SHAMPÁN</Text><Text className="mt-2 text-xs leading-5 text-zinc-500">Una experiencia premium para encontrar tus licores sellados favoritos.</Text></View>
  </ScrollView>;
}