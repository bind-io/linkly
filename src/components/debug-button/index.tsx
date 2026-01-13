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
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        title="Debug Console"
      >
        <TbMoodNerd className="w-5 h-5" />
        {errorCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
          >
            {errorCount > 99 ? "99+" : errorCount}
          </motion.span>
        )}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Debug Console"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          {errors.length === 0 ? (
            <div className="text-center py-12">
              <TbMoodNerd className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">No errors logged</p>
              <p className="text-sm text-muted-foreground mt-2">
                All systems operational! 🎉
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total Errors:
                  </span>
                  <span className="bg-destructive/20 text-destructive px-3 py-1 rounded-full text-sm font-bold">
                    {errorCount}
                  </span>
                </div>
                <button
                  onClick={handleClearErrors}
                  className="btn-secondary text-xs"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                {errors.map((error, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-destructive/5 border border-destructive/20 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-destructive font-medium break-words">
                          {error.message}
                        </p>
                        {error.context && (
                          <p className="text-xs text-muted-foreground mt-2 font-mono bg-muted p-2 rounded">
                            {error.context}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(error.timestamp)}
                      </span>
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
