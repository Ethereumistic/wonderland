"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { IconSun, IconMoon } from "@tabler/icons-react";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      className="inline-flex items-center focus:outline-none text-black dark:text-white"
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <IconMoon className="w-8 h-8 mr-2 " />
      ) : (
        <IconSun className="w-8 h-8 mr-2 " />
      )}
    </button>
  );
};

export default ThemeSwitch;