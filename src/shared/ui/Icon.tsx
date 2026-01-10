import ICONS_TEMP from "@shared/constants/icons";
import type { IconList } from "@shared/constants/icons";

interface IconProps {
  icon: IconList;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "2.5xl" | "3xl" | "4xl" | "5xl" | "6xl";
  className?: string;
  rotate?: number;
  inversion?: boolean;
}

const sizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-7 h-7",
  "2xl": "w-8 h-8",
  "2.5xl": "w-10 h-10",
  "3xl": "w-12 h-12",
  "4xl": "w-16 h-16",
  "5xl": "w-20 h-20",
  "6xl": "w-24 h-24",
};

export const Icon = ({
  icon,
  size = "md",
  rotate = 0,
  inversion = false,
  className = "",
}: IconProps) => {
  const iconData = ICONS_TEMP[icon];

  if (!iconData) {
    console.warn(`Icon "${icon}" not found`);
    return null;
  }

  const sizeClass = sizeClasses[size];
  const rotateClass = rotate !== 0 ? `transform rotate-${rotate}` : "";
  const inversionClass = inversion ? "invert" : "";

  return (
    <svg
      className={`${sizeClass} ${rotateClass} ${inversionClass} ${className}`}
      viewBox={iconData.svgOptions?.viewBox || "0 0 24 24"}
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {iconData.icon}
    </svg>
  );
};

export default Icon;
export type { IconList };
