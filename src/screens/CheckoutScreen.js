import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { orderApi } from "../services/api";
import { useApp } from "../context/AppContext";

const money = v => `C$ ${Number(v).toLocaleString("es-NI")}`;

export default function CheckoutScreen({ navigation }) {
  const { cart, total, clearCart, token } = useApp();
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const field = (key) => ({ value: form[key], onChangeText: v => setForm({ ...form, [key]: v }) });

  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) return Alert.alert("Completa tus datos", "Nombre, teléfono y dirección son obligatorios.");
    if (cart.length === 0) return Alert.alert("Carrito vacío", "Agrega productos antes de confirmar tu pedido.");

    setLoading(true);

    try {
      const order = await orderApi.create({
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        address: form.address.trim(),
        notes: form.notes.trim() || undefined,
        items: cart.map((item) => ({ product_id: item.id, quantity: item.quantity }))
      }, token);

      clearCart();

      const buttons = token ? [{ text: "Ver mis pedidos", onPress: () => navigation.navigate("Pedidos") }] : [{ text: "Entendido" }];
      const hint = token ? "" : "\n\nInicia sesión en tu cuenta para guardar el historial de pedidos.";

      Alert.alert("¡Pedido confirmado!", `Tu pedido ${order.code} fue registrado por ${money(order.total)}.${hint}`, buttons);
    } catch (error) {
      Alert.alert("No pudimos confirmar tu pedido", error.message);
    } finally {
      setLoading(false);
    }
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
    <View className="mt-2 rounded-2xl border border-gold-600/30 bg-[#18130a] p-5"><Text className="text-xs text-zinc-500">TOTAL A PAGAR</Text><Text className="mt-1 text-3xl font-black text-gold-300">{money(total)}</Text><Text className="mt-2 text-[10px] text-zinc-600">El servidor confirma stock y precio final al registrar el pedido.</Text></View>
    <Pressable onPress={submit} disabled={loading} className={`mt-5 items-center rounded-2xl py-4 ${loading ? "bg-gold-400/60" : "bg-gold-400"}`}>{loading ? <ActivityIndicator color="#000" /> : <Text className="font-black text-black">CONFIRMAR PEDIDO</Text>}</Pressable>
  </ScrollView>;
}
