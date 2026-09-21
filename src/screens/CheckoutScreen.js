import React, { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { orderApi } from "../services/api";
import { describeError } from "../services/errors";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { useSectionNavigation } from "../hooks/useSectionNavigation";
import { money } from "../utils/format";

export default function CheckoutScreen() {
  const { cart, total, clearCart, token } = useApp();
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const { show } = useToast();
  const goTo = useSectionNavigation();
  const field = (key) => ({ value: form[key], onChangeText: v => setForm({ ...form, [key]: v }) });

  const submit = async () => {
    const missing = [
      !form.name.trim() && "el nombre",
      !form.phone.trim() && "el teléfono",
      !form.address.trim() && "la dirección"
    ].filter(Boolean);

    if (missing.length > 0) {
      show(`Falta ${missing.join(", ")}`, "error");
      return;
    }

    if (cart.length === 0) {
      show("Tu carrito está vacío", "error");
      return;
    }

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
      show(`Pedido ${order.code} confirmado por ${money(order.total)}`);

      if (token) goTo("Pedidos");
    } catch (error) {
      const { title, message } = describeError(error, "No pudimos confirmar tu pedido");
      show(`${title}: ${message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return <ScrollView className="flex-1 bg-canvas px-5 pt-5" contentContainerStyle={{paddingBottom:50}}>
    <Text className="text-2xl font-black text-content">Finalizar compra</Text>
    <Text className="mb-7 mt-1 text-sm text-muted">Entrega segura y sencilla.</Text>
    {[
      ["Nombre completo","Ej. Juan Pérez","name"],
      ["Teléfono","Ej. 8888-8888","phone"],
      ["Dirección de entrega","Barrio, calle, referencias...","address"],
      ["Notas del pedido","Indicaciones adicionales (opcional)","notes"]
    ].map(([label,placeholder,key])=><View key={key} className="mb-4"><Text className="mb-2 text-xs font-bold text-content">{label}</Text><TextInput {...field(key)} placeholder={placeholder} placeholderTextColor={colors.placeholder} multiline={key==="address"||key==="notes"} className={`rounded-2xl border border-line bg-surface px-4 py-4 text-content ${key==="address"||key==="notes"?"min-h-24":""}`}/></View>)}
    <View className="mt-2 rounded-2xl border border-gold-600/30 bg-tint p-5"><Text className="text-xs text-muted">TOTAL A PAGAR</Text><Text className="mt-1 text-3xl font-black text-accent">{money(total)}</Text><Text className="mt-2 text-[10px] text-subtle">El servidor confirma stock y precio final al registrar el pedido.</Text></View>
    <Pressable onPress={submit} disabled={loading} className={`mt-5 items-center rounded-2xl py-4 ${loading ? "bg-gold-400/60" : "bg-accent-strong"}`}>{loading ? <ActivityIndicator color={colors.onAccent} /> : <Text className="font-black text-black">CONFIRMAR PEDIDO</Text>}</Pressable>
  </ScrollView>;
}
