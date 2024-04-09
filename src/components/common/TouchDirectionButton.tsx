import { forwardRef } from "react";

import { cn } from "@/utils";

import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "text-white hover:text-yellow-300 focus:text-yellow-300 border-4 border-gray-300 active:border-yellow-300 rounded-full bg-gray-300/30 hover:bg-yellow-300/10 active:bg-yellow-300/20",
};

const sizes = {
  sm: "w-8 h-8",
  md: "w-16 h-16",
  lg: "w-12 h-12",
};

const rotations = {
  left: "transform -rotate-90",
  right: "transform rotate-90",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  rotation?: keyof typeof rotations;
  className?: string;
};

export const TouchDirectionButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      rotation = "left",
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          "flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none transition-colors select-none",
          rotations[rotation],
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        <svg
          className="w-full h-full select-none"
          fill="none"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.8288 11.948L16.2428 10.534L11.9998 6.29004L7.75684 10.533L9.17184 11.947L10.9998 10.12V17.657H12.9998V10.12L14.8288 11.948Z"
            fill="currentColor"
          />
        </svg>
      </button>
    );
  }
);

TouchDirectionButton.displayName = "TouchDirectionButton";
