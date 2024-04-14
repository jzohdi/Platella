import { FooterElement } from "@/features/Layout/components/Footer";
import PageHeader from "@/features/components/PageHeader";
import { FOOTER } from "@/features/config/constants";
import { api } from "@/utils/api";
import Image from "next/image";
import { useRouter } from "next/router";
import { CiCirclePlus } from "react-icons/ci";
import { IoLibrary } from "react-icons/io5";
import { RxStarFilled } from "react-icons/rx";
import { TbTrashX } from "react-icons/tb";
import { FaBook } from "react-icons/fa";
import Spacer from "@/features/components/Spacer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export const footerElements: FooterElement[] = [
  {
    display: <IoLibrary size={FOOTER.ICON_SIZE} />,
    action: "navigate_home",
  },
  {
    display: <RxStarFilled size={FOOTER.ICON_SIZE} />,
    action: "favorite",
  },
  {
    display: <TbTrashX size={FOOTER.ICON_SIZE} />,
    action: "delete",
  },
  {
    display: <CiCirclePlus size={FOOTER.ICON_SIZE} />,
    action: "new",
  },
];

export default function BookPage() {
  const router = useRouter();
  const bookId = router.query.bookId ?? "";
  const { data: bookData, isPending } = api.book.get.useQuery({
    bookId: bookId as string,
  });
  const owner = bookData?.users.find(({ role }) => role === "owner");
  return (
    <div>
      <Spacer size={20} />
      {isPending ? (
        <BookSkeleton />
      ) : (
        <>
          <PageHeader
            icon={<FaBook size={30} />}
            title={bookData?.title ?? ""}
          />
          <Spacer size={20} />
          <div className="relative max-w-[800px]">
            <AspectRatio ratio={4 / 5} className="overflow-hidden rounded-md ">
              <Image
                src={`https://platella.s3.us-east-1.amazonaws.com/${owner?.id}/${bookData?.images[0]}`}
                // src={`https://s3.amazonaws.com/platella/${owner?.userId}/${book.images[0]}`}
                alt={`Book ${bookData?.title}`}
                fill
                className="object-cover"
                sizes="200px"
                priority
              />
            </AspectRatio>
          </div>
        </>
      )}
    </div>
  );
}

function BookSkeleton() {
  return (
    <>
      <div className="flex w-full flex-col items-center space-y-5">
        <Skeleton className="h-[30px] w-[250px] rounded-xl" />
        <Skeleton className="h-[400px] w-full max-w-[800px]" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
    </>
  );
}
