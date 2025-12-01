import { FiMoon, FiSun, FiMonitor } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 bg-secondary rounded-full border border-border">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-full transition-all duration-200 ${
          theme === "light"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Light Mode"
      >
        <FiSun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-full transition-all duration-200 ${
          theme === "system"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="System Mode"
      >
        <FiMonitor className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-full transition-all duration-200 ${
          theme === "dark"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Dark Mode"
      >
        <FiMoon className="w-4 h-4" />
      </button>
    </div>
  );
}
