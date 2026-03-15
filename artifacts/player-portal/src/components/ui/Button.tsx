import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: "bg-[var(--academy-primary,#333)] text-white hover:brightness-110 shadow-lg shadow-black/20 hover:shadow-[var(--academy-primary)]/20",
      secondary: "bg-[var(--academy-secondary,#555)] text-white hover:brightness-110 shadow-lg shadow-black/20",
      outline: "border-2 border-white/20 bg-transparent text-white hover:bg-white/5",
      ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/10",
      glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-12 px-6 text-base font-semibold",
      lg: "h-14 px-8 text-lg font-bold",
      icon: "h-12 w-12 flex items-center justify-center"
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider font-display",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
