import React from "react";

const Badge = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  rounded = "full",
  ...props
}) => {
  // Base classes
  const baseClasses = "inline-flex items-center justify-center font-medium";
  
  // Variant classes
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    accent: "bg-accent-100 text-accent-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    dark: "bg-dark-800 text-white",
  };
  
  // Size classes
  const sizeClasses = {
    xs: "text-xs px-1.5 py-0.5",
    sm: "text-sm px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
    xl: "text-lg px-3.5 py-1",
  };
  
  // Rounded classes
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };
  
  // Combine all classes
  const badgeClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClasses[rounded]} ${className}`;
  
  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge; 