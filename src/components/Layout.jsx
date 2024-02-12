import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="relative bg-opacity-100">

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          className="object-cover w-full h-full"
        >
          <source src="/images/Carvideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      {children}
    </div>
  );
};

export default Layout;
