import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { authApi } from "../services/api";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

export default function ProfileScreen({ navigation }) {
  const { user, token, login, register, logout, setUser, favorites, orders } = useApp();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const field = (key, source = form, setSource = setForm) => ({
    value: source[key],
    onChangeText: (value) => setSource({ ...source, [key]: value })
  });

  const submitSession = async () => {
    setLoading(true);

    try {
      if (mode === "login") {
        await login({ email: form.email.trim(), password: form.password });
      } else {
        await register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim() || undefined
        });
      }

      setForm({ name: "", email: "", password: "", phone: "" });
    } catch (error) {
      Alert.alert(
        mode === "login" ? "No pudimos iniciar sesión" : "No pudimos crear tu cuenta",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    setProfile({ name: user.name, phone: user.phone ?? "" });
    setEditing(true);
  };

  const saveProfile = async () => {
    setLoading(true);

    try {
      const updated = await authApi.updateMe(
        { name: profile.name.trim(), phone: profile.phone.trim() },
        token
      );

      setUser(updated);
      setEditing(false);
    } catch (error) {
      Alert.alert("No pudimos guardar tus datos", error.message);
    } finally {
      setLoading(false);
    }
  };

  const item = (label, value, action) => <Pressable onPress={action} className="flex-row items-center justify-between border-b border-line px-5 py-5"><View><Text className="font-bold text-content">{label}</Text>{value && <Text className="mt-1 text-[10px] text-subtle">{value}</Text>}</View><Text className="text-xl text-subtle">›</Text></Pressable>;

  if (!user) {
    return <ScrollView className="flex-1 bg-canvas px-5 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="items-center"><View className="h-24 w-24 items-center justify-center rounded-full border border-gold-500 bg-tint"><Text className="text-5xl">♙</Text></View><Text className="mt-4 text-2xl font-black text-content">Mi cuenta</Text><Text className="mt-1 text-xs text-muted">Inicia sesión para ver tus pedidos y favoritos</Text></View>
      <View className="mt-8 rounded-2xl border border-line bg-surface p-5">
        <Text className="text-lg font-black text-content">{mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}</Text>
        {mode === "register" && <View className="mt-4"><Text className="mb-2 text-xs font-bold text-content">Nombre completo</Text><TextInput {...field("name")} placeholder="Ej. Juan Pérez" placeholderTextColor={colors.placeholder} className="rounded-2xl border border-line bg-elevated px-4 py-4 text-content" /></View>}
        <View className="mt-4"><Text className="mb-2 text-xs font-bold text-content">Correo</Text><TextInput {...field("email")} autoCapitalize="none" keyboardType="email-address" placeholder="tucorreo@ejemplo.com" placeholderTextColor={colors.placeholder} className="rounded-2xl border border-line bg-elevated px-4 py-4 text-content" /></View>
        <View className="mt-4"><Text className="mb-2 text-xs font-bold text-content">Contraseña</Text><TextInput {...field("password")} secureTextEntry placeholder="Mínimo 8 caracteres" placeholderTextColor={colors.placeholder} className="rounded-2xl border border-line bg-elevated px-4 py-4 text-content" /></View>
        {mode === "register" && <View className="mt-4"><Text className="mb-2 text-xs font-bold text-content">Teléfono (opcional)</Text><TextInput {...field("phone")} keyboardType="phone-pad" placeholder="8888-8888" placeholderTextColor={colors.placeholder} className="rounded-2xl border border-line bg-elevated px-4 py-4 text-content" /></View>}
        <Pressable onPress={submitSession} disabled={loading} className="mt-5 items-center rounded-2xl bg-accent-strong py-4">{loading ? <ActivityIndicator color={colors.onAccent} /> : <Text className="font-black text-black">{mode === "login" ? "ENTRAR" : "CREAR CUENTA"}</Text>}</Pressable>
        <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")} className="mt-4 items-center"><Text className="text-xs font-bold text-accent">{mode === "login" ? "¿No tienes cuenta? Regístrate" : "Ya tengo cuenta, iniciar sesión"}</Text></Pressable>
        <Text className="mt-4 text-center text-[10px] text-subtle">Cuenta demo: demo@elshampan.com / Demo1234</Text>
      </View>
      <View className="mt-5 rounded-2xl border border-gold-600/20 bg-tint p-5"><Text className="font-black text-accent">EL SHAMPÁN</Text><Text className="mt-2 text-xs leading-5 text-muted">Una experiencia premium para encontrar tus licores sellados favoritos.</Text></View>
    </ScrollView>;
  }

  return <ScrollView className="flex-1 bg-canvas px-5 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
    <View className="items-center"><View className="h-24 w-24 items-center justify-center rounded-full border border-gold-500 bg-tint"><Text className="text-5xl">♙</Text></View><Text className="mt-4 text-2xl font-black text-content">{user.name}</Text><Text className="mt-1 text-xs text-muted">{user.email}</Text></View>
    <View className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
      {item("Mis pedidos", `${orders.length} pedido(s)`, () => navigation.navigate("Pedidos"))}
      {item("Favoritos", `${favorites.length} producto(s)`, () => navigation.navigate("Favoritos"))}
      {item("Datos personales", user.phone ? `Teléfono ${user.phone}` : "Nombre, teléfono y cuenta", editing ? () => setEditing(false) : startEditing)}
      {item("Ayuda y soporte", "Estamos para ayudarte", () => Alert.alert("Soporte", "Contáctanos desde el canal de soporte configurado por el equipo."))}
      {item("Cerrar sesión", "Salir de tu cuenta", logout)}
    </View>
    {editing && <View className="mt-5 rounded-2xl border border-line bg-surface p-5">
      <Text className="text-lg font-black text-content">Datos personales</Text>
      <View className="mt-4"><Text className="mb-2 text-xs font-bold text-content">Nombre completo</Text><TextInput {...field("name", profile, setProfile)} placeholder="Tu nombre" placeholderTextColor={colors.placeholder} className="rounded-2xl border border-line bg-elevated px-4 py-4 text-content" /></View>
      <View className="mt-4"><Text className="mb-2 text-xs font-bold text-content">Teléfono</Text><TextInput {...field("phone", profile, setProfile)} keyboardType="phone-pad" placeholder="8888-8888" placeholderTextColor={colors.placeholder} className="rounded-2xl border border-line bg-elevated px-4 py-4 text-content" /></View>
      <Pressable onPress={saveProfile} disabled={loading} className="mt-5 items-center rounded-2xl bg-accent-strong py-4">{loading ? <ActivityIndicator color={colors.onAccent} /> : <Text className="font-black text-black">GUARDAR CAMBIOS</Text>}</Pressable>
    </View>}
    <View className="mt-5 rounded-2xl border border-gold-600/20 bg-tint p-5"><Text className="font-black text-accent">EL SHAMPÁN</Text><Text className="mt-2 text-xs leading-5 text-muted">Una experiencia premium para encontrar tus licores sellados favoritos.</Text></View>
  </ScrollView>;
}
