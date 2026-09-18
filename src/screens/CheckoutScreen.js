import React, { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useApp } from "../context/AppContext";

const money = v => `C$ ${v.toLocaleString("es-NI")}`;

export default function CheckoutScreen({ navigation }) {
  const { total, clearCart, setOrders } = useApp();
  const [form,setForm]=useState({name:"",phone:"",address:"",notes:""});
  const field=(key)=>({value:form[key],onChangeText:v=>setForm({...form,[key]:v})});

  const submit=()=>{
    if(!form.name.trim()||!form.phone.trim()||!form.address.trim()) return Alert.alert("Completa tus datos","Nombre, teléfono y dirección son obligatorios.");
    const order={id:`EC-${Date.now().toString().slice(-6)}`,date:new Date().toLocaleDateString("es-NI"),total,status:"Recibido"};
    setOrders(prev=>[order,...prev]); clearCart();
    Alert.alert("¡Pedido confirmado!",`Tu pedido ${order.id} fue registrado.`,[{text:"Ver mis pedidos",onPress:()=>navigation.navigate("Pedidos")}]);
  };

  return <ScrollView className="flex-1 bg-black px-5 pt-5" contentContainerStyle={{paddingBottom:50}}>
    <Text className="text-2xl font-black text-white">Finalizar compra</Text>
    <Text className="mb-7 mt-1 text-sm text-zinc-500">Entrega segura y sencilla.</Text>
    {[
      ["Nombre completo","Ej. Juan Pérez","name"],
      ["Teléfono","Ej. 8888-8888","phone"],
      ["Dirección de entrega","Barrio, calle, referencias...","address"],
      ["Notas del pedido","Indicaciones adicionales (opcional)","notes"]
    ].map(([label,placeholder,key])=><View key={key} className="mb-4"><Text className="mb-2 text-xs font-bold text-zinc-300">{label}</Text><TextInput {...field(key)} placeholder={placeholder} placeholderTextColor="#666" multiline={key==="address"||key==="notes"} className={`rounded-2xl border border-zinc-800 bg-[#111111] px-4 py-4 text-white ${key==="address"||key==="notes"?"min-h-24":""}`}/></View>)}
    <View className="mt-2 rounded-2xl border border-gold-600/30 bg-[#18130a] p-5"><Text className="text-xs text-zinc-500">TOTAL A PAGAR</Text><Text className="mt-1 text-3xl font-black text-gold-300">{money(total)}</Text><Text className="mt-2 text-[10px] text-zinc-600">El método de pago y validaciones finales se conectarán al backend.</Text></View>
    <Pressable onPress={submit} className="mt-5 rounded-2xl bg-gold-400 py-4 items-center"><Text className="font-black text-black">CONFIRMAR PEDIDO</Text></Pressable>
  </ScrollView>;
}