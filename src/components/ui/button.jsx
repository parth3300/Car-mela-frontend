import React from "react";

const ButtonStart = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonStart;
