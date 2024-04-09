import * as React from "react";
import { cn } from "@/utils";

const variants = {
  primary:
    "bg-gray-800 text-white border-2 border-gray-600 hover:border-yellow-300 hover:text-yellow-200 ",
  inverse:
    "text-white border-2 border-gray-600 hover:border-yellow-300 hover:text-yellow-200 ",
  danger: "bg-red-600 text-white",
};

const sizes = {
  sm: "py-2 px-4 text-sm md:text-base",
  md: "py-2 px-6 text-base",
  lg: "py-3 px-8 text-lg",
};

type IconProps =
  | { startIcon: React.ReactElement; endIcon?: never }
  | { endIcon: React.ReactElement; startIcon?: never }
  | { endIcon?: undefined; startIcon?: undefined };

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
} & IconProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = "button",
      className = "",
      variant = "primary",
      size = "md",
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed rounded-md shadow-sm font-medium focus:outline-none transition-colors uppercase font-nextgames",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {startIcon}
        <span className="mx-2">{props.children}</span> {endIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
