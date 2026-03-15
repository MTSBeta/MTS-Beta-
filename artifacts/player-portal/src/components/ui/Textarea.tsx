import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-white/80 uppercase tracking-wider font-display ml-1">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-xl glass-input px-4 py-3 text-base font-medium resize-y transition-all disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500/50 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-red-400 font-medium ml-1">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
