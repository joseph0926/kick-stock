import { cn } from "@/lib/utils";
import { ComponentProps, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  [
    "rounded-sm border bg-background flex gap-2.5 p-4",
    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
    "hover:border-primary/50 transition-colors",
  ],
  {
    variants: {
      variant: {
        list: "w-full h-14 flex-row justify-between",
        box: "size-[100px] flex-col",
      },
      size: {
        sm: "p-2 gap-1.5",
        md: "p-4 gap-2.5",
        lg: "p-6 gap-3.5",
      },
    },
    defaultVariants: {
      variant: "list",
      size: "md",
    },
  },
);

type CardProps = ComponentProps<"article"> &
  VariantProps<typeof cardVariants> & {
    cardType: NonNullable<VariantProps<typeof cardVariants>["variant"]>;
    label?: string;
  };

/**
 * UI를 위한 래퍼 컴포넌트입니다.
 * @param variant list | box
 * @param size sm | md | lg
 * @param label aria-label을 위한 옵셔널 props입니다.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, cardType, size, label, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant: cardType, size }), className)}
        role="region"
        aria-label={`${label || "클럽"} 주식 카드`}
        tabIndex={0}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";
