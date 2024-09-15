import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CustomSelect = ({ placeholder, options = [], value, setValue }) => {
  return (
    <Select
      defaultValue={value}
      onValueChange={(changeValue) => setValue(changeValue)}
    >
      <SelectTrigger className="w-full md:w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map((item) => (
          <SelectItem value={item?._id} key={item?._id}>
            {item?.name}
            {item?.code && (
              <span
                className={`bg-[${item?.code} ] w-10 h-10 rounded-full`}
              ></span>
            )}
          </SelectItem>
        ))}
        <SelectItem value={null}>All</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
