import * as React from "react";
import { cn } from "@/utils";

const variants = {
  glass: "bg-gray-800 bg-clip-padding backdrop-blur-md bg-opacity-90 ",
};

const sizes = {
  md: "mx-4 my-4 md:mx-0 w-full md:w-3/4 max-w-screen-lg h-[80svh] py-8 pl-8 pr-6",
};

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

export const Container: React.FC<ContainerProps> = ({
  className = "",
  variant = "glass",
  size = "md",
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  );
};

Container.displayName = "Container";
