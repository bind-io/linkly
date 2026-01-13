import { useState } from "react";
import { FaCheck, FaCopy, FaExternalLinkAlt, FaRedo } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export function Link({
  title,
  onNewClick,
}: {
  title: string;
  onNewClick: () => void;
}): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(title);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="my-8"
    >
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-shadow">
        <div className="bg-gradient-to-r from-green-500/20 to-primary/20 px-6 py-4 border-b border-border flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium text-green-500">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-green-500"
            ></motion.div>
            URL Generated Successfully
          </span>
          <div className="flex gap-2">
            <button
              onClick={onNewClick}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors px-3 py-1 rounded-md hover:bg-muted"
            >
              <FaRedo /> New Link
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-muted/50 rounded-lg p-4 mb-6 break-all font-mono text-sm text-primary border-2 border-primary/30 hover:border-primary/50 transition-colors">
            {title}
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              className={`flex-1 btn-primary ${
                copied ? "bg-green-600 hover:bg-green-700" : ""
              }`}
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={title}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-6"
            >
              <FaExternalLinkAlt />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
