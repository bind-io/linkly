import { HiMoon, HiSun } from "react-icons/hi";
import { HiComputerDesktop } from "react-icons/hi2";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-secondary/60 backdrop-blur-md rounded-xl border-2 border-border/60 shadow-sm">
      <motion.button
        onClick={() => setTheme("light")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`p-2 rounded-lg transition-all duration-300 ${
          theme === "light"
            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/30"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        }`}
        title="Light Mode"
      >
        <HiSun className="w-5 h-5" />
      </motion.button>
      <motion.button
        onClick={() => setTheme("system")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`p-2 rounded-lg transition-all duration-300 ${
          theme === "system"
            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/30"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        }`}
        title="System Mode"
      >
        <HiComputerDesktop className="w-5 h-5" />
      </motion.button>
      <motion.button
        onClick={() => setTheme("dark")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`p-2 rounded-lg transition-all duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/30"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        }`}
        title="Dark Mode"
      >
        <HiMoon className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
