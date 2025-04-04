import React from "react";
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/solid";

const Alert = ({
  children,
  className = "",
  variant = "info",
  title,
  onClose,
  ...props
}) => {
  // Base classes
  const baseClasses = "p-4 rounded-lg";
  
  // Variant classes
  const variantClasses = {
    success: "bg-green-50 text-green-800 border border-green-200",
    warning: "bg-yellow-50 text-yellow-800 border border-yellow-200",
    danger: "bg-red-50 text-red-800 border border-red-200",
    info: "bg-blue-50 text-blue-800 border border-blue-200",
  };
  
  // Icon mapping
  const iconMapping = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    danger: XCircleIcon,
    info: InformationCircleIcon,
  };
  
  // Icon color mapping
  const iconColorMapping = {
    success: "text-green-500",
    warning: "text-yellow-500",
    danger: "text-red-500",
    info: "text-blue-500",
  };
  
  // Combine all classes
  const alertClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  // Get the appropriate icon component
  const Icon = iconMapping[variant];
  
  return (
    <div className={alertClasses} role="alert" {...props}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColorMapping[variant]}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          <div className={`text-sm ${title ? "mt-1" : ""}`}>
            {children}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${iconColorMapping[variant]} hover:bg-opacity-20 hover:bg-${variant}-500`}
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert; 