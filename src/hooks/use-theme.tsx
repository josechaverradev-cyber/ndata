import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();
  
  return {
    theme: theme || "system",
    setTheme,
    systemTheme,
    resolvedTheme,
    isDark: resolvedTheme === "dark",
  };
}
