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
    "inline-flex items-center justify-center font-jetbrains uppercase tracking-wider transition-all duration-300 px-6 py-2 overflow-hidden group hover:glitch-text text-center cursor-none focus:outline-none focus:ring-1 focus:ring-primary";

  const variants = {
    primary:
      "bg-primary/20 text-primary hover:bg-primary/30 hover:shadow-[0_0_15px_#C8FF00,0_0_15px_#C8FF00_inset]",
    outline:
      "bg-transparent text-primary/80 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_10px_#C8FF00]",
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  const renderContent = () => (
    <>
      <span 
        className="absolute inset-0 border border-primary z-10 transition-colors pointer-events-none"
        style={{ clipPath: "polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)" }}
      ></span>
      <span className="relative z-20" data-text={typeof children === 'string' ? children : ''}>{children}</span>
      {/* Glitch hover effect background */}
      <span className="absolute inset-0 w-full h-full -rotate-45 scale-150 translate-x-full group-hover:translate-x-0 bg-primary/10 transition-transform duration-500 ease-out z-0"></span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} style={{ clipPath: "polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)" }}>
        {renderContent()}
      </Link>
    );
  }

  return (
    <button className={classes} {...props} style={{ clipPath: "polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)" }}>
      {renderContent()}
    </button>
  );
}
