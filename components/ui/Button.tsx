import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:text-text-faint";

const variantMap: Record<Variant, string> = {
  primary:
    "bg-text-primary text-bg-base hover:bg-text-muted disabled:bg-bg-elevated",
  secondary:
    "border border-border-subtle bg-bg-surface text-text-primary hover:border-border-strong hover:bg-bg-elevated disabled:bg-bg-surface",
  ghost:
    "text-text-muted hover:text-text-primary hover:bg-bg-elevated disabled:hover:bg-transparent",
};

const sizeMap: Record<Size, string> = {
  sm: "h-7 px-2.5 text-micro",
  md: "h-9 px-3.5 text-body",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "secondary", size = "md", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variantMap[variant], sizeMap[size], className)}
      {...props}
    />
  );
});
