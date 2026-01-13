import { motion } from "framer-motion";
import { ThemeToggle } from "../theme-toggle";
import { HiSparkles } from "react-icons/hi";
import { RiLinksFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";

export function Header() {
  const { t } = useTranslation();
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full border-b border-border/40 glass-effect sticky top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Elegante e sofisticado */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 opacity-50"></div>
              <div className="relative bg-gradient-to-br from-primary via-primary to-primary/80 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300">
                <RiLinksFill className="w-5 h-5 text-primary-foreground" />
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute -top-1 -right-1"
              >
                <HiSparkles className="w-3 h-3 text-primary drop-shadow-lg" />
              </motion.div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black gradient-text tracking-tight">{t('header.title')}</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">{t('header.subtitle')}</span>
            </div>
          </motion.div>

          {/* Actions - Refinadas */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
