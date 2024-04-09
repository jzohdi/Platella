import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormImageInput = {
  title: string;
  name: string;
  onChange: (file: File) => void;
};

export default function FormImageInput({
  title,
  name,
  onChange,
}: FormImageInput) {
  return (
    <FormField
      name={name}
      render={({}) => (
        <FormItem>
          <FormLabel>{title}</FormLabel>
          <FormControl>
            <Input
              accept="image/*"
              type="file"
              onChange={(e) => {
                const filesList = e.target.files;
                if (!filesList) {
                  return;
                }
                const file = filesList[0];
                if (!file) {
                  return;
                }
                onChange(file);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
