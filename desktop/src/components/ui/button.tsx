import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs",
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs",
        destructive: "bg-danger text-white hover:opacity-90 shadow-xs",
        outline: "border border-border bg-surface hover:bg-surface-2 hover:text-text-primary",
        secondary: "bg-surface-2 text-text-primary hover:bg-border",
        ghost: "hover:bg-surface-2 text-text-secondary hover:text-text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        champagne: "bg-champagne text-white hover:bg-champagne-hover shadow-xs",
      },
      size: {
        default: "h-9 px-4 py-1.5 text-sm",
        sm: "h-7 px-2.5",
        lg: "h-9 px-5",
        xl: "h-11 px-7 text-sm",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
