import React from "react";
import { View } from "react-native";
import Sidebar from "../components/Sidebar";
import { useIsWide } from "../hooks/useResponsive";
import Tabs from "./Tabs";

// One navigation tree, two chromes: bottom tabs on phones, a persistent sidebar
// from 900px up. The state of every screen survives crossing the breakpoint
// because the navigator is never unmounted, only the bar is hidden.
export default function ResponsiveShell() {
  const isWide = useIsWide();

  if (!isWide) return <Tabs />;

  return (
    <View className="flex-1 flex-row bg-canvas">
      <Sidebar />
      <View className="flex-1">
        <Tabs compact />
      </View>
    </View>
  );
}
