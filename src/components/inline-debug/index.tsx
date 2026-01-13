import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { TbMoodNerd } from "react-icons/tb";
import { errorStorage, ErrorLog } from "../../services/storage";
import { useTranslation } from "react-i18next";

export function InlineDebug() {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateErrors = () => {
      const allErrors = errorStorage.getAll();
      setErrors(allErrors);
    };

    updateErrors();
    const interval = window.setInterval(updateErrors, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleClearErrors = () => {
    errorStorage.clear();
    setErrors([]);
    setIsExpanded(false);
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(timestamp));
  };

  if (errors.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <div className="card border-destructive/40 bg-destructive/5">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="bg-destructive/10 p-2.5 rounded-xl">
              <TbMoodNerd className="w-6 h-6 text-destructive" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-black text-foreground">
                  {t("debug.errorLog")}
                </h3>
                <span className="bg-destructive/20 text-destructive px-3 py-1 rounded-full text-xs font-bold">
                  {errors.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {t("debug.debugInfo")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isExpanded && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearErrors();
                }}
                className="btn-secondary text-xs px-4 py-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t("debug.clearAll")}
              </motion.button>
            )}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-muted-foreground"
            >
              {isExpanded ? (
                <HiChevronUp className="w-6 h-6" />
              ) : (
                <HiChevronDown className="w-6 h-6" />
              )}
            </motion.div>
          </div>
        </button>

        {/* Expandable content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t-2 border-border/40 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {errors.map((error, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-destructive/10 hover:bg-destructive/15 border-2 border-destructive/30 hover:border-destructive/40 rounded-xl p-5 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-destructive animate-pulse"></div>
                        <span className="text-xs font-bold text-destructive uppercase tracking-wider">
                          {t("debug.error")} #{errors.length - index}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium px-2.5 py-1 bg-muted/50 rounded-lg">
                        {formatDate(error.timestamp)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-bold break-words mb-2">
                        {error.message}
                      </p>
                      {error.context && (
                        <div className="bg-muted/80 border-2 border-border/50 rounded-lg p-3 mt-3">
                          <p className="text-xs text-muted-foreground font-mono break-all">
                            {error.context}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
