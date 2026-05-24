import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-sm border border-border-subtle bg-bg-base px-3 text-body text-text-primary placeholder:text-text-faint",
        "transition-colors duration-150 ease-out",
        "focus:border-border-strong focus:ring-2 focus:ring-border-strong focus:ring-offset-1 focus:ring-offset-bg-base",
        className,
      )}
      {...props}
    />
  );
});
