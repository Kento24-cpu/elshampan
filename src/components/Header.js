import React from "react";
import { Pressable, Text, View } from "react-native";

export default function Header({ navigation, title, subtitle, showBack = false }) {
  return (
    <View className="flex-row items-center justify-between px-5 pt-3 pb-4">
      <View className="flex-1 flex-row items-center">
        {showBack && <Pressable onPress={() => navigation.goBack()} className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-zinc-900"><Text className="text-xl text-white">‹</Text></Pressable>}
        <View>
          <Text className="text-2xl font-black tracking-tight text-white">{title}</Text>
          {subtitle && <Text className="mt-1 text-xs text-zinc-500">{subtitle}</Text>}
        </View>
      </View>
    </View>
  );
}