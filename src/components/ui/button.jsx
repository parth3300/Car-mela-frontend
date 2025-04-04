import React from "react";
import { motion } from "framer-motion";

const ButtonStart = ({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary", 
  size = "md",
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  type = "button",
  ...props 
}) => {
  // Base classes
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // Variant classes
  const variantClasses = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-button hover:shadow-hover",
    secondary: "bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-button hover:shadow-hover",
    accent: "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 shadow-button hover:shadow-hover",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-dark-700 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-button hover:shadow-hover",
  };
  
  // Size classes
  const sizeClasses = {
    xs: "text-xs px-2 py-1 rounded-md",
    sm: "text-sm px-3 py-1.5 rounded-lg",
    md: "text-base px-4 py-2 rounded-lg",
    lg: "text-lg px-5 py-2.5 rounded-lg",
    xl: "text-xl px-6 py-3 rounded-lg",
  };
  
  // Width classes
  const widthClasses = fullWidth ? "w-full" : "";
  
  // Disabled classes
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${disabledClasses} ${className}`;
  
  // Icon rendering
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconClasses = size === "xs" ? "h-3 w-3" : 
                        size === "sm" ? "h-4 w-4" : 
                        size === "md" ? "h-5 w-5" : 
                        size === "lg" ? "h-6 w-6" : 
                        "h-7 w-7";
    
    return React.cloneElement(icon, { className: `${iconClasses} ${iconPosition === "left" ? "mr-2" : "ml-2"}` });
  };
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {iconPosition === "left" && renderIcon()}
      {children}
      {iconPosition === "right" && renderIcon()}
    </motion.button>
  );
};

export default ButtonStart;
