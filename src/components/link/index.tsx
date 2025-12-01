import { useState } from "react";
import { FaCheck, FaCopy, FaExternalLinkAlt, FaRedo } from "react-icons/fa";

export function Link({
  title,
  onNewClick,
}: {
  title: string;
  onNewClick: () => void;
}): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 animate-fade-in">
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl shadow-primary/10">
        <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium text-green-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            URL Generated Successfully
          </span>
          <div className="flex gap-2">
            <button
              onClick={onNewClick}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <FaRedo /> Reset
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-muted rounded-lg p-4 mb-6 break-all font-mono text-sm text-primary border border-primary/20">
            {title}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className={`flex-1 btn-primary ${
                copied ? "bg-green-600 hover:bg-green-700" : ""
              }`}
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>

            <a
              href={title}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-6"
            >
              <FaExternalLinkAlt />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
