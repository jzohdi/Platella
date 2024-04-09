import { type FooterElement } from "@/features/Layout/components/Footer";
import { FOOTER } from "@/features/config/constants";
import { IoLibrary } from "react-icons/io5";
import { FaFileUpload } from "react-icons/fa";
import getFooterActionBroker from "@/features/Layout/hooks/useFooterActions";
import {
  type KeyboardEvent,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
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
import { isEmail } from "../../../utils/email";
import { api } from "@/utils/api";
import { bookTitle, listOfEmails } from "@/utils/zod";
import { uploadFileToAws } from "@/utils/fetch";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const formSchema = z.object({
  title: bookTitle,
  cover: z.custom<File>((v) => v instanceof File, {
    message: "Cover photo is required",
  }),
  collaborators: listOfEmails,
});

function createObjectURL(image: File) {
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
const BROKER_ID = "add_book_page";
let submitData: z.infer<typeof formSchema> | null = null;

export default function AddBookPage() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      cover: undefined,
      collaborators: [],
    },
  });

  const handleSucces = () => {
    const imageInput = imageInputRef.current;
    if (!imageInput) {
      return;
    }
    imageInput.value = "";
    form.reset();
    submitData = null;
    router.push(routes.library).catch((e) => {
      console.log("could not navigate to library", e);
    });
  };

  const coverImage = form.watch("cover");
  const imagePreview = useMemo(() => {
    if (!coverImage) {
      return null;
    }
    return createObjectURL(coverImage);
  }, [coverImage]);

  const { mutate: createBook, isSuccess: isBookSuccess } =
    api.book.create.useMutation({
      onError(error) {
        toast({
          variant: "destructive",
          title: "Could not create Book",
          description: error.message,
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
      },
      onSuccess: () => handleSucces(),
    });
  const {
    data: presignUrlData,
    mutate: mutatePresignedUrl,
    isPending,
  } = api.file.getPresignedUrl.useMutation();

  useEffect(() => {
    if (submitData === null || !presignUrlData) {
      return;
    }
    const { title, cover, collaborators } = submitData;
    const { url, id } = presignUrlData;
    if (!url || !id || !title || !cover) {
      return;
    }

    const imageInput = imageInputRef.current;
    if (!imageInput) {
      return;
    }
    imageInput.value = "";
    // await uploadFileToAws(url, file);
    createBook({
      title: title,
      collaborators: collaborators,
      coverKey: id,
    });
  }, [presignUrlData, form, createBook]);

  useEffect(() => {
    if (!isBookSuccess) {
      return;
    }
    const imageInput = imageInputRef.current;
    if (!imageInput) {
      return;
    }
    imageInput.value = "";
    form.reset();
    submitData = null;
    router.push(routes.library).catch((e) => {
      console.log("could not navigate to library", e);
    });
  }, [isBookSuccess, form, router]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!isPending) {
      mutatePresignedUrl({ fetch: true });
      submitData = values;
    }
  };

  broker.subscribe(BROKER_ID, "navigate_home", () => {
    router.push(routes.library).catch((e) => {
      console.log("could not route home", e);
    });
    return;
  });

  broker.subscribe(BROKER_ID, "submit", () => {
    form
      .handleSubmit(onSubmit)()
      .catch((e) => {
        console.log("could not submit form", e);
      });
  });

  useEffect(() => {
    return () => {
      broker.unsubscribe(BROKER_ID, "navigate_home");
      broker.unsubscribe(BROKER_ID, "submit");
    };
  }, []);

  function handleKeyDownEmail(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    const value = e.currentTarget.value;
    const didAdd = handleAddEmail(value);
    if (didAdd) {
      e.currentTarget.value = "";
    }
  }

  function handleAddEmail(value: string) {
    if (!value) {
      return false;
    }
    if (!isEmail(value)) {
      form.setError("collaborators", {
        message: "Not a valid email",
      });
      return false;
    }
    const currentArr = form.getValues().collaborators;
    const newArr = currentArr ?? [];
    if (newArr.includes(value)) {
      form.setError("collaborators", {
        message: "Email already added",
      });
      return false;
    }
    newArr.push(value);
    form.setValue("collaborators", newArr);
    return true;
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
                    onKeyDown={handleKeyDownEmail}
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
            control={form.control}
            name="cover"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Cover Photo</FormLabel>
                <FormControl>
                  <Input
                    {...rest}
                    ref={imageInputRef}
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
