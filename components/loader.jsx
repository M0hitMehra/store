// components/Loader.js

import React from "react";
import "@/app/globals.css";

const Loader = () => {
  return (
    <div className=" w-screen fixed top-0 left-0 h-screen flex justify-center items-center  bg-gray-900 bg-opacity-15">
      <div className="loader w-full h-full"></div>
    </div>
  );
};

export default Loader;
