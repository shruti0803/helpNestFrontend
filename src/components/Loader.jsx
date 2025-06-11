import React from 'react';
import './Loader.css'; // keep the CSS separate for animation

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
