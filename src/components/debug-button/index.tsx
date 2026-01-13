import { useState, useEffect } from "react";
import { TbMoodNerd } from "react-icons/tb";
import { Modal } from "../modal";
import { errorStorage, ErrorLog } from "../../services/storage";
import { motion } from "framer-motion";

export function DebugButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    // Update error count on mount and when modal opens
    const updateErrors = () => {
      const allErrors = errorStorage.getAll();
      setErrors(allErrors);
      setErrorCount(allErrors.length);
    };

    updateErrors();

    // Poll for new errors every 2 seconds when modal is open
    let interval: number | undefined;
    if (isOpen) {
      interval = window.setInterval(updateErrors, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen]);

  const handleClearErrors = () => {
    errorStorage.clear();
    setErrors([]);
    setErrorCount(0);
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(timestamp));
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative p-2.5 rounded-xl hover:bg-secondary/80 transition-all duration-200 text-muted-foreground hover:text-foreground group"
        title="Debug Console"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <TbMoodNerd className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
        {errorCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-destructive/30 ring-2 ring-background"
          >
            {errorCount > 99 ? "99+" : errorCount}
          </motion.span>
        )}
      </motion.button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Debug Console"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">
          {errors.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"></div>
                <TbMoodNerd className="w-20 h-20 mx-auto text-primary relative" />
              </div>
              <h3 className="text-xl font-bold mb-2">All Clear!</h3>
              <p className="text-muted-foreground text-base">No errors logged</p>
              <p className="text-sm text-muted-foreground mt-3 bg-success/10 text-success border border-success/20 px-4 py-2 rounded-lg inline-block font-medium">
                ✨ All systems operational!
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="bg-destructive/10 p-2 rounded-lg">
                    <TbMoodNerd className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        Error Log
                      </span>
                      <span className="bg-destructive/20 text-destructive px-2.5 py-0.5 rounded-full text-xs font-bold">
                        {errorCount}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">Debug information</span>
                  </div>
                </div>
                <motion.button
                  onClick={handleClearErrors}
                  className="btn-secondary text-xs px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear All
                </motion.button>
              </div>

              <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
                {errors.map((error, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-destructive/5 hover:bg-destructive/10 border border-destructive/20 hover:border-destructive/30 rounded-xl p-5 transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-destructive animate-pulse"></div>
                        <span className="text-xs font-medium text-destructive uppercase tracking-wider">Error #{errors.length - index}</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-muted/50 rounded-md">
                        {formatDate(error.timestamp)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-semibold break-words mb-2">
                        {error.message}
                      </p>
                      {error.context && (
                        <div className="bg-muted/80 border border-border/50 rounded-lg p-3 mt-3">
                          <p className="text-xs text-muted-foreground font-mono break-all">
                            {error.context}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
