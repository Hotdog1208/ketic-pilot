import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "waste" | "save" | "muted";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
};

const toneStyles: Record<Tone, { color: string; bg: string }> = {
  neutral: { color: "#F5F5F7", bg: "rgba(245,245,247,0.10)" },
  waste: { color: "#E5484D", bg: "rgba(229,72,77,0.10)" },
  save: { color: "#2BD17E", bg: "rgba(43,209,126,0.10)" },
  muted: { color: "#8A8F9B", bg: "rgba(138,143,155,0.10)" },
};

export function Badge({ tone = "neutral", className, style, children, ...props }: BadgeProps) {
  const t = toneStyles[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-micro font-medium tnum",
        className,
      )}
      style={{ color: t.color, backgroundColor: t.bg, ...style }}
      {...props}
    >
      {children}
    </span>
  );
}
