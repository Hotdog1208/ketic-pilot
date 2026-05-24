import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-9 w-full appearance-none rounded-sm border border-border-subtle bg-bg-base px-3 pr-8 text-body text-text-primary",
        "transition-colors duration-150 ease-out",
        "focus:border-border-strong focus:ring-2 focus:ring-border-strong focus:ring-offset-1 focus:ring-offset-bg-base",
        "bg-[length:8px_8px] bg-[position:right_12px_center] bg-no-repeat",
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%238A8F9B' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>\")",
      }}
      {...props}
    >
      {children}
    </select>
  );
});
