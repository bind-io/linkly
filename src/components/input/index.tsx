import { InputHTMLAttributes } from "react";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  startIcon?: JSX.Element;
}
export function TextInput({ label, error, ...props }: TextInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.name}
          className="block mb-3 text-sm font-bold text-foreground tracking-wide"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        <input
          className={`input-field ${
            error
              ? "border-destructive/60 focus:ring-destructive/20 focus:border-destructive"
              : ""
          }`}
          {...props}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 animate-fade-in">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 flex-shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">{error}</span>
        </div>
      )}
    </div>
  );
}
