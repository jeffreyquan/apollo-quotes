import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

interface UseTheme {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

export const useTheme = (): UseTheme => {
  const [theme, setTheme] = useState<Theme>("light");

  const [mounted, setMounted] = useState(false);

  const setMode = (mode) => {
    window.localStorage.setItem("theme", mode);
    setTheme(mode);
  };

  const toggleTheme = () => {
    theme === "light" ? setMode("dark") : setMode("light");
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    localTheme ? setTheme(localTheme as Theme) : setMode("dark");
    setMounted(true);
  }, []);

  return { theme, toggleTheme, mounted };
};
