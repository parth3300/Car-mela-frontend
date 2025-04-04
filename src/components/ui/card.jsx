import React from "react";
import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  variant = "default",
  hoverable = false,
  onClick,
  padding = "md",
  border = true,
  shadow = true,
  ...props
}) => {
  // Base classes
  const baseClasses = "rounded-xl overflow-hidden";
  
  // Variant classes
  const variantClasses = {
    default: "bg-white",
    primary: "bg-primary-50",
    secondary: "bg-secondary-50",
    accent: "bg-accent-50",
    dark: "bg-dark-800 text-white",
  };
  
  // Padding classes
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };
  
  // Border classes
  const borderClasses = border ? "border border-gray-200" : "";
  
  // Shadow classes
  const shadowClasses = shadow ? "shadow-card" : "";
  
  // Hover classes
  const hoverClasses = hoverable ? "transition-all duration-300 hover:shadow-hover" : "";
  
  // Cursor classes
  const cursorClasses = onClick ? "cursor-pointer" : "";
  
  // Combine all classes
  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${borderClasses} ${shadowClasses} ${hoverClasses} ${cursorClasses} ${className}`;
  
  // Wrapper component based on whether it's clickable
  const Wrapper = onClick ? motion.div : "div";
  
  return (
    <Wrapper
      className={cardClasses}
      onClick={onClick}
      whileHover={hoverable && onClick ? { y: -5 } : {}}
      {...props}
    >
      {children}
    </Wrapper>
  );
};

// Card Header component
const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div className={`pb-4 mb-4 border-b border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Body component
const CardBody = ({ children, className = "", ...props }) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

// Card Footer component
const CardFooter = ({ children, className = "", ...props }) => {
  return (
    <div className={`pt-4 mt-4 border-t border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Image component
const CardImage = ({ src, alt, className = "", ...props }) => {
  return (
    <div className={`overflow-hidden ${className}`} {...props}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105" 
      />
    </div>
  );
};

// Card Title component
const CardTitle = ({ children, className = "", ...props }) => {
  return (
    <h3 className={`text-xl font-bold text-dark-900 ${className}`} {...props}>
      {children}
    </h3>
  );
};

// Card Subtitle component
const CardSubtitle = ({ children, className = "", ...props }) => {
  return (
    <p className={`text-sm text-dark-600 ${className}`} {...props}>
      {children}
    </p>
  );
};

// Attach sub-components to Card
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;

export default Card; 