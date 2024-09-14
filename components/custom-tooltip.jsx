import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import clsx from "clsx";
import { TooltipArrow } from "@radix-ui/react-tooltip";

const CustomTooltip = ({
  children,
  content,
  className,
  sideOffset = 5,
  side = "right",
}) => {
  return (
    <TooltipProvider>
      <Tooltip side="right">
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className={className}
          sideOffset={sideOffset}
          side={side}
        >
          {content}
          <TooltipArrow className=" fill-gray-300 " />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
