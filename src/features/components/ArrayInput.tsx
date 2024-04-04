import { Badge } from "@/components/ui/badge";
import { Input, type InputProps } from "@/components/ui/input";
import { forwardRef } from "react";
import Spacer from "./Spacer";
import { MdOutlineCancel } from "react-icons/md";

type ArrayInputProps = InputProps & {
  value?: string[];
  handleDelete: (value: string) => void;
};

export default forwardRef<HTMLInputElement, ArrayInputProps>(
  function ArrayInput({ value, handleDelete, ...rest }, ref) {
    return (
      <div className="relative">
        <span>
          {value?.map((item) => {
            return (
              <Badge
                key={item}
                className="text-md pl-5 pr-1"
                onClick={() => handleDelete(item)}
              >
                <span className="flex items-center">
                  {item}
                  <MdOutlineCancel className="ml-2" size={25} />
                </span>
              </Badge>
            );
          })}
        </span>
        <Spacer size={5} />
        <Input {...rest} ref={ref} />
      </div>
    );
  },
);
