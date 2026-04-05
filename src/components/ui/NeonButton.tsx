import React from "react";
import Link from "next/link";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "outline";
  children: React.ReactNode;
}

export function NeonButton({
  href,
  variant = "primary",
  children,
  className = "",
  ...props
}: NeonButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-jetbrains uppercase tracking-wider transition-all duration-300 px-6 py-2 border relative overflow-hidden group";

  const variants = {
    primary:
      "bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:shadow-[0_0_15px_#C8FF00,0_0_15px_#C8FF00_inset]",
    outline:
      "bg-transparent border-primary/50 text-primary/80 hover:border-primary hover:text-primary hover:shadow-[0_0_10px_#C8FF00]",
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  const renderContent = () => (
    <>
      <span className="relative z-10">{children}</span>
      {/* Glitch hover effect background */}
      <span className="absolute inset-0 w-full h-full -rotate-45 scale-150 translate-x-full group-hover:translate-x-0 bg-primary/10 transition-transform duration-500 ease-out z-0"></span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {renderContent()}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {renderContent()}
    </button>
  );
}
