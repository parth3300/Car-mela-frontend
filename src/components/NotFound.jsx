import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <img
        src="images/404-error-page-templates.jpg.webp"
        alt="404"
        className="w-[80vh] mb-8"
      />
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg text-gray-300">
        The page you are looking for might be in another galaxy.
      </p>
    </div>
  );
};

export default NotFound;
