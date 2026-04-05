import React from "react";

interface BadgeProps {
  label: string;
  color?: "default" | "neon" | "dim";
  className?: string;
}

export function Badge({ label, color = "default", className = "" }: BadgeProps) {
  const colors = {
    default: "bg-neutral border-primary/30 text-primary/80",
    neon: "bg-primary/20 border-primary text-primary shadow-glow",
    dim: "bg-background border-gray-700 text-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-jetbrains border ${colors[color]} ${className}`}
    >
      {label}
    </span>
  );
}
