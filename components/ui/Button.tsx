import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-sabr-green text-white hover:bg-[#05a858] disabled:bg-gray-300 disabled:text-gray-500",
  secondary:
    "bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500",
  ghost:
    "bg-transparent text-black hover:bg-gray-100 disabled:text-gray-400",
};

export function Button({
  variant = "primary",
  children,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
