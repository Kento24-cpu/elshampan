import { useWindowDimensions } from "react-native";

// One breakpoint for the whole app: below it the bottom tabs, from it up the
// persistent sidebar.
export const SIDEBAR_BREAKPOINT = 900;
export const SIDEBAR_WIDTH = 264;
export const GRID_GAP = 12;
export const GRID_PADDING = 18;

export function useIsWide() {
  const { width } = useWindowDimensions();

  return width >= SIDEBAR_BREAKPOINT;
}

// The width a screen really has to lay content out, once the sidebar is taken.
export function useContentWidth() {
  const { width } = useWindowDimensions();

  return width >= SIDEBAR_BREAKPOINT ? width - SIDEBAR_WIDTH : width;
}

export function useProductGrid() {
  const contentWidth = useContentWidth();

  const columns = contentWidth >= 1100 ? 4 : contentWidth >= 760 ? 3 : 2;
  const usable = contentWidth - GRID_PADDING * 2 - GRID_GAP * (columns - 1);

  return { columns, itemWidth: Math.floor(usable / columns) };
}
