import { type FooterElement } from "@/features/Layout/components/Footer";
import { FOOTER } from "@/features/config/constants";
import { IoLibrary } from "react-icons/io5";
import { FaFileUpload } from "react-icons/fa";
import getFooterActionBroker from "@/features/Layout/hooks/useFooterActions";
import { useEffect, useState } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  cover: z.custom<File>((v) => v instanceof File, {
    message: "Image is required",
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
  }, [router]);

  const coverImage = form.watch("cover");
  const imagePreview = !!coverImage ? createObjectURL(coverImage) : null;

  return (
    <div className="py-5">
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
            name="cover"
            render={({ field }) => (
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
                />
              )}
            </AspectRatio>
          </div>
          <Button type="submit">
            <FaFileUpload size={20} className="mr-2" />
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
