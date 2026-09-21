import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

const VISIBLE_MS = 2600;

const TONES = {
  success: { icon: "checkmark-circle", token: "accent" },
  error: { icon: "alert-circle", token: "danger" },
  info: { icon: "information-circle", token: "muted" }
};

export default function Toast({ toast, onHide }) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!toast) return undefined;

    progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 200, useNativeDriver: true }).start();

    const timer = setTimeout(() => {
      Animated.timing(progress, { toValue: 0, duration: 180, useNativeDriver: true })
        .start(({ finished }) => finished && onHide());
    }, VISIBLE_MS);

    return () => clearTimeout(timer);
  }, [toast, progress, onHide]);

  if (!toast) return null;

  const tone = TONES[toast.tone] ?? TONES.info;

  return (
    // box-none lets every tap through except the banner itself, so it never
    // blocks the UI underneath.
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: insets.top + 12,
        alignItems: "center",
        paddingHorizontal: 16,
        opacity: progress,
        transform: [{
          translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] })
        }]
      }}
    >
      <View
        style={{
          shadowColor: "#000",
          shadowOpacity: isDark ? 0.5 : 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6
        }}
      >
        <Pressable
          onPress={onHide}
          accessibilityRole="alert"
          accessibilityLabel={toast.message}
          style={{ maxWidth: 420 }}
          className="flex-row items-center rounded-2xl border border-line bg-surface px-4 py-3"
        >
          <Ionicons name={tone.icon} size={18} color={colors[tone.token]} />
          <Text className="ml-2 flex-1 text-sm font-bold text-content">{toast.message}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
