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
      onValueChange={(changeValue)=> setValue(changeValue)}
    >
      <SelectTrigger className="w-full md:w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map((item) => (
          <SelectItem value={item?._id} key={item?._id}>
            {item?.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
