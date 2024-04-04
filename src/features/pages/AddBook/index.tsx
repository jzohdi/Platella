import { type FooterElement } from "@/features/Layout/components/Footer";
import { FOOTER } from "@/features/config/constants";
import { IoLibrary } from "react-icons/io5";
import { FaFileUpload } from "react-icons/fa";
import getFooterActionBroker from "@/features/Layout/hooks/useFooterActions";
import { type KeyboardEvent, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import routes from "@/features/config/routes";
import PageHeader from "@/features/components/PageHeader";
import { IoBookOutline } from "react-icons/io5";
import Spacer from "@/features/components/Spacer";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import VisibleLarge from "@/features/components/Breakpoints/VisibleLarge";
import ArrayInput from "@/features/components/ArrayInput";
import { isEmail } from "./utils/email";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  cover: z.custom<File>((v) => v instanceof File, {
    message: "Image is required",
  }),
  collaborators: z
    .string()
    .array()
    .optional()
    .refine((val) => {
      val?.every((email) => {
        return isEmail(email);
      });
    }),
});

function createObjectURL(image: File) {
  // const binaryData = [];
  // binaryData.push(data);
  // URL.createObjectURL(coverImage);
  // return window.URL.createObjectURL(
  //   new Blob(binaryData, { type: "application/zip" }),
  // );
  return URL.createObjectURL(image);
}

export const addBookFooterActions: FooterElement[] = [
  {
    action: "navigate_home",
    display: <IoLibrary size={FOOTER.ICON_SIZE} />,
  },
  {
    action: "submit",
    display: <FaFileUpload size={FOOTER.ICON_SIZE} />,
  },
] as const;

const broker = getFooterActionBroker();

export default function AddBookPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      cover: undefined,
      collaborators: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  useEffect(() => {
    const id = "add_book_page";

    broker.subscribe(id, "navigate_home", () => {
      router.push(routes.library).catch((e) => {
        console.log("could not route home", e);
      });
      return;
    });

    broker.subscribe(id, "submit", () => {
      console.log("submit new book");
      form.handleSubmit(onSubmit);
    });

    return () => {
      broker.unsubscribe(id, "navigate_home");
      broker.unsubscribe(id, "submit");
    };
  }, [router, form]);

  const coverImage = form.watch("cover");

  const imagePreview = useMemo(() => {
    if (!coverImage) {
      return null;
    }
    return createObjectURL(coverImage);
  }, [coverImage]);

  function handleAddEmail(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    const value = e.currentTarget.value;
    if (!value) {
      return;
    }
    if (!isEmail(value)) {
      return form.setError("collaborators", {
        message: "Not a valid email",
      });
    }
    const currentArr = form.getValues().collaborators;
    const newArr = currentArr ?? [];
    if (newArr.includes(value)) {
      return form.setError("collaborators", {
        message: "Email already added",
      });
    }
    newArr.push(value);
    form.setValue("collaborators", newArr);
  }

  function handleDeleteEmail(value: string) {
    const currentArr = form.getValues().collaborators ?? [];
    const filtered = currentArr.filter((item) => item !== value);
    form.setValue("collaborators", filtered);
  }

  return (
    <div className="m-auto max-w-[750px] py-5">
      <PageHeader
        icon={<IoBookOutline size={30} className="mr-2" />}
        title="New Book"
      />
      <Spacer size={20} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="My New Book" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="collaborators"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collaborators</FormLabel>
                <FormControl>
                  <ArrayInput
                    handleDelete={handleDeleteEmail}
                    placeholder="Collaborators"
                    {...field}
                    onKeyDown={handleAddEmail}
                    onChange={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      return;
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Enter emails of users to share with.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="cover"
            render={({}) => (
              <FormItem>
                <FormLabel>Cover Photo</FormLabel>
                <FormControl>
                  <Input
                    accept="image/*"
                    type="file"
                    placeholder="Cover Photo"
                    onChange={(e) => {
                      const filesList = e.target.files;
                      if (!filesList) {
                        return;
                      }
                      const file = filesList[0];
                      if (!file) {
                        return;
                      }
                      form.setValue("cover", file);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <label htmlFor="preview" className="block pb-3 font-bold">
              Preview
            </label>
            <AspectRatio ratio={16 / 9} className="bg-muted">
              {imagePreview && (
                <Image
                  id="preview"
                  src={imagePreview}
                  alt="preview"
                  fill
                  className="rounded-md object-cover"
                  style={{ objectFit: "contain" }}
                />
              )}
            </AspectRatio>
          </div>
          <VisibleLarge>
            <Button type="submit">
              <FaFileUpload size={20} className="mr-2" />
              Submit
            </Button>
          </VisibleLarge>
        </form>
      </Form>
    </div>
  );
}
