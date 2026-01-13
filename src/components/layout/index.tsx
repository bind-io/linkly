import { motion } from "framer-motion";
import { Header } from "../header";
import { LanguageSelector } from "../language-selector";
import { useTranslation } from "react-i18next";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Subtle background effect */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
        {children}
      </main>

      {/* Footer elegante */}
      <footer className="border-t border-border/40 mt-16 glass-effect">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                {t("footer.madeWith")}
              </span>
              <motion.span
                className="text-red-500 text-base"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ♥
              </motion.span>
              <span className="text-muted-foreground">{t("footer.by")}</span>
              <a
                href="https://github.com/bind-io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-bold transition-colors"
              >
                Bind
              </a>
            </div>
            <motion.a
              href="https://github.com/bind-io/linkly"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-semibold group"
              whileHover={{ scale: 1.05 }}
            >
              <span>{t("footer.openSource")}</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </motion.a>
          </div>
          <div className="mt-6 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-medium text-center sm:text-left">
              © {new Date().getFullYear()} Linkly. {t("footer.tagline")}
            </p>
            <LanguageSelector />
          </div>
        </div>
      </footer>
    </div>
  );
}
