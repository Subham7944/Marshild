import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#8E24AA] text-white shadow-md hover:shadow-lg hover:bg-[#7B1FA2] hover:translate-y-[-2px]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-[#8E24AA]/30 bg-background shadow-sm hover:bg-[#8E24AA]/10 hover:text-[#8E24AA] hover:border-[#8E24AA] hover:shadow-md",
        secondary:
          "bg-[#3949AB] text-white shadow-md hover:bg-[#303F9F] hover:shadow-lg",
        ghost: "hover:bg-[#8E24AA]/10 hover:text-[#8E24AA]",
        link: "text-[#8E24AA] underline-offset-4 hover:underline",
        accent: "bg-[#FF7043] text-white shadow-md hover:shadow-lg hover:bg-[#F4511E] font-semibold hover:translate-y-[-2px]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
