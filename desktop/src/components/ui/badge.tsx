import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary-tint text-primary border border-primary/20",
        success: "bg-success-subtle text-success-text border border-success/20",
        warning: "bg-warning-subtle text-warning-text border border-warning/30",
        danger: "bg-danger-subtle text-danger-text border border-danger/20",
        info: "bg-info-subtle text-info-text border border-info/20",
        champagne: "bg-champagne-subtle text-champagne-text border border-champagne/30",
        premium: "bg-champagne-subtle text-champagne-text border border-champagne/30",
        outline: "text-text-secondary border border-border",
        neutral: "bg-surface-2 text-text-secondary",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
