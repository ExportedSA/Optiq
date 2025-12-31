"use client";

import { ReactNode } from "react";

interface ModernBadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "default";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  pulse?: boolean;
}

export function ModernBadge({ 
  children, 
  variant = "default",
  size = "md",
  icon,
  pulse = false
}: ModernBadgeProps) {
  const baseStyles = "inline-flex items-center gap-1.5 font-semibold rounded-full";
  
  const variantStyles = {
    success: "bg-green-100 text-green-700 border border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    error: "bg-red-100 text-red-700 border border-red-200",
    info: "bg-blue-100 text-blue-700 border border-blue-200",
    default: "bg-gray-100 text-gray-700 border border-gray-200",
  };
  
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };
  
  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {icon}
      {children}
    </span>
  );
}
