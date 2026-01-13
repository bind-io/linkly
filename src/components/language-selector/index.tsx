import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HiGlobeAlt } from "react-icons/hi2";

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", label: "EN", flag: "🇺🇸" },
    { code: "pt", label: "PT", flag: "🇧🇷" },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <div className="flex items-center gap-2">
      <HiGlobeAlt className="w-4 h-4 text-muted-foreground" />
      <div className="flex items-center gap-1.5 p-1.5 bg-secondary/60 backdrop-blur-md rounded-xl border-2 border-border/60 shadow-sm">
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`px-3 py-1.5 rounded-lg transition-all duration-300 font-semibold text-sm flex items-center gap-1.5 ${
              i18n.language === lang.code
                ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
            title={lang.label}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
