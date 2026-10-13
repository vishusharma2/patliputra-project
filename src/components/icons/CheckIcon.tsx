import React from "react";
import { IconProps } from "./YouTubeIcon";

export default function CheckIcon({
  size = 20,
  className,
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={className}
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
