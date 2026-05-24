import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn("w-full border-collapse text-body", className)}
      {...props}
    />
  );
}

export function Thead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn(className)} {...props} />;
}

export function Tbody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn(className)} {...props} />;
}

type TrProps = HTMLAttributes<HTMLTableRowElement> & { interactive?: boolean };

export function Tr({ className, interactive, ...props }: TrProps) {
  return (
    <tr
      className={cn(
        interactive && "transition-colors duration-150 ease-out hover:bg-bg-elevated",
        className,
      )}
      {...props}
    />
  );
}

type ThProps = ThHTMLAttributes<HTMLTableCellElement> & {
  align?: "left" | "right" | "center";
};

export function Th({ className, align = "left", ...props }: ThProps) {
  return (
    <th
      className={cn(
        "border-b border-border-subtle py-3 text-label uppercase text-text-muted",
        align === "left" && "text-left",
        align === "right" && "text-right",
        align === "center" && "text-center",
        "px-3 first:pl-0 last:pr-0",
        className,
      )}
      {...props}
    />
  );
}

type TdProps = TdHTMLAttributes<HTMLTableCellElement> & {
  align?: "left" | "right" | "center";
};

export function Td({ className, align = "left", ...props }: TdProps) {
  return (
    <td
      className={cn(
        "py-3 align-middle",
        align === "left" && "text-left",
        align === "right" && "text-right",
        align === "center" && "text-center",
        "px-3 first:pl-0 last:pr-0",
        className,
      )}
      {...props}
    />
  );
}
