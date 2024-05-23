// components/Loader.js

import React from "react";
import "@/app/globals.css";

const Loader = () => {
  return (
    <div className=" w-screen fixed h-screen flex justify-center items-center  bg-gray-900 bg-opacity-15">
      <div className="loader "></div>
    </div>
  );
};

export default Loader;
