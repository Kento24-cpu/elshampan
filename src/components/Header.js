import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function Header({ navigation, title, subtitle, showBack = false, action = null }) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center justify-between px-5 pt-3 pb-4">
      <View className="flex-1 flex-row items-center">
        {showBack && (
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-elevated"
          >
            <Ionicons name="chevron-back" size={20} color={colors.content} />
          </Pressable>
        )}
        <View className="flex-1">
          <Text className="text-2xl font-black tracking-tight text-content">{title}</Text>
          {subtitle && <Text className="mt-1 text-xs text-muted">{subtitle}</Text>}
        </View>
      </View>
      {action}
    </View>
  );
}
