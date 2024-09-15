import clsx from "clsx";
import { Loader } from "lucide-react";
import React from "react";

const ComponentLoader = ({className}) => {
  return <Loader className={clsx("animate-spin",className)} />;
};

export default ComponentLoader;
