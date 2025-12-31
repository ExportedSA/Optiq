"use client";

import { ReactNode } from "react";

interface ModernCardProps {
  children: ReactNode;
  variant?: "default" | "glass" | "gradient";
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ModernCard({ 
  children, 
  variant = "default", 
  hover = true,
  className = "",
  onClick 
}: ModernCardProps) {
  const baseStyles = "rounded-2xl p-6 transition-all duration-200";
  
  const variants = {
    default: "bg-white border border-gray-200 shadow-sm hover:shadow-md",
    glass: "glass backdrop-blur-xl bg-white/80 border-white/20 shadow-lg",
    gradient: "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg",
  };
  
  const hoverStyles = hover ? "hover:-translate-y-1 cursor-pointer" : "";
  
  return (
    <div 
      className={`rounded-xl transition-all duration-200 p-6 ${variants[variant]} ${hover && "hover:shadow-lg hover:-translate-y-0.5"} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
