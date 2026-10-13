interface IconProps {
  size?: number;
  className?: string;
}

export default function NavigationIcon({ size = 20, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}
