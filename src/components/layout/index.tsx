import BrandingWhite from "../../assets/branding-white.png";
import Branding from "../../assets/branding.png";
import { ThemeToggle } from "../theme-toggle";
import { DebugButton } from "../debug-button";
import { motion } from "framer-motion";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 flex items-center gap-2"
      >
        <DebugButton />
        <ThemeToggle />
      </motion.div>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center justify-center mb-12"
        >
          <div className="relative group">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              src={BrandingWhite}
              alt="Linkly"
              className="w-[180px] relative hidden dark:block"
              draggable={false}
            />
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              src={Branding}
              alt="Linkly"
              className="w-[180px] relative block dark:hidden"
              draggable={false}
            />
          </div>
          <p className="mt-4 text-muted-foreground text-center max-w-md">
            Professional UTM builder. Generate clean, tracked URLs in seconds.
          </p>
        </motion.div>

        {children}
      </main>
    </div>
  );
}
