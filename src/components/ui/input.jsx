import React, { forwardRef } from "react";

const Input = forwardRef(({
  label,
  error,
  helperText,
  className = "",
  size = "md",
  variant = "default",
  fullWidth = false,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  // Base classes
  const baseClasses = "w-full rounded-lg transition-all duration-200 focus:outline-none";
  
  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg",
  };
  
  // Variant classes
  const variantClasses = {
    default: "border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200",
    filled: "bg-gray-100 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200",
    outlined: "border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200",
  };
  
  // Error classes
  const errorClasses = error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "";
  
  // Width classes
  const widthClasses = fullWidth ? "w-full" : "";
  
  // Icon padding classes
  const iconPaddingClasses = {
    left: leftIcon ? "pl-10" : "",
    right: rightIcon ? "pr-10" : "",
  };
  
  // Combine all classes
  const inputClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${errorClasses} ${widthClasses} ${iconPaddingClasses.left} ${iconPaddingClasses.right} ${className}`;
  
  // Label classes
  const labelClasses = `block text-sm font-medium mb-1 ${error ? "text-red-600" : "text-dark-700"}`;
  
  // Helper text classes
  const helperTextClasses = `mt-1 text-sm ${error ? "text-red-600" : "text-dark-500"}`;
  
  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {React.cloneElement(leftIcon, { className: "h-5 w-5 text-gray-400" })}
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {React.cloneElement(rightIcon, { className: "h-5 w-5 text-gray-400" })}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={helperTextClasses}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input; 