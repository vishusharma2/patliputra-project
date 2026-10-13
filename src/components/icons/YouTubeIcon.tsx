import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export default function YouTubeIcon({
  size = 18,
  className,
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.582 6.186a2.71 2.71 0 0 0-1.905-1.917C17.994 3.8 12 3.8 12 3.8s-5.994 0-7.677.469a2.71 2.71 0 0 0-1.905 1.917C2 7.876 2 12 2 12s0 4.124.418 5.814a2.71 2.71 0 0 0 1.905 1.917c1.683.469 7.677.469 7.677.469s5.994 0 7.677-.469a2.71 2.71 0 0 0 1.905-1.917C22 16.124 22 12 22 12s0-4.124-.418-5.814zM10 15.5V8.5l6 3.5-6 3.5z"
      />
    </svg>
  );
}
