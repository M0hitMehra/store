import React from "react";

const Error = ({ statusCode, message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-4"> {statusCode}</h1>
      <p className="text-xl text-gray-700">{message}</p>
    </div>
  );
};

export default Error;
