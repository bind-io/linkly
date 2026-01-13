import { useState } from "react";
import { FaCheck, FaCopy, FaExternalLinkAlt, FaRedo, FaChartLine } from "react-icons/fa";
import { HiCheckCircle } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function Link({
  title,
  onNewClick,
}: {
  title: string;
  onNewClick: () => void;
}): JSX.Element {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(title);
      setCopied(true);
      toast.success(t("toast.linkCopied"), {
        icon: "📋",
        style: {
          borderRadius: "12px",
          background: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
        },
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast.error(t("toast.copyFailed"));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", duration: 0.6 }}
      className="my-10"
    >
      <div className="relative card overflow-hidden group border-primary/20 shadow-2xl shadow-primary/10">
        {/* Animated background gradient - mais suave */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-100 transition-opacity duration-700"></div>
        
        {/* Success header - mais elegante */}
        <div className="relative flex items-center justify-between mb-8 pb-6 border-b-2 border-border/40">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-success/30 rounded-full blur-lg"></div>
              <div className="relative bg-gradient-to-br from-success to-success/80 p-2 rounded-xl">
                <HiCheckCircle className="w-7 h-7 text-white" />
              </div>
            </motion.div>
            <div>
              <h3 className="text-2xl font-black text-foreground mb-1">{t("link.title")}</h3>
              <p className="text-sm text-muted-foreground font-medium">{t("link.subtitle")}</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewClick}
            className="flex items-center gap-2.5 px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/70 transition-all border-2 border-transparent hover:border-border/60"
          >
            <FaRedo className="w-4 h-4" />
            <span className="hidden sm:inline">{t("link.newButton")}</span>
          </motion.button>
        </div>

        {/* URL Display - mais destaque */}
        <div className="relative mb-8">
          <div className="relative group/url">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-sm opacity-0 group-hover/url:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-muted/60 to-muted/40 backdrop-blur-md rounded-2xl p-6 border-2 border-border/60 hover:border-primary/40 transition-all duration-300 shadow-lg">
              <div className="flex items-start justify-between gap-4 mb-3">
                <code className="flex-1 text-base text-primary font-['Fira_Code',monospace] font-semibold break-all leading-relaxed">
                  {title}
                </code>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <FaChartLine className="w-4 h-4 text-primary/60" />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  {title.length} {t("link.characters")}
                </span>
                <span className="text-muted-foreground font-mono">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons - mais sofisticados */}
        <div className="relative grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCopy}
            className={`relative col-span-2 sm:col-span-1 btn-primary h-14 text-base shadow-xl transition-all duration-300 ${
              copied ? "bg-gradient-to-br from-success to-success/90 shadow-success/30" : "shadow-primary/30"
            }`}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="copied"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3"
                >
                  <FaCheck className="w-5 h-5" />
                  <span className="font-black">{t("link.copiedButton")}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3"
                >
                  <FaCopy className="w-5 h-5" />
                  <span className="font-black">{t("link.copyButton")}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            href={title}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 sm:col-span-1 btn-secondary h-14 flex items-center justify-center gap-3 text-base shadow-lg"
          >
            <FaExternalLinkAlt className="w-4 h-4" />
            <span className="font-black">{t("link.openButton")}</span>
          </motion.a>
        </div>

        {/* Info box - mais refinado */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-6 border-t-2 border-border/40"
        >
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="flex items-center gap-2 text-success font-semibold">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span>{t("link.success")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
