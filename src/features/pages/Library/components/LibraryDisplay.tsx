import routes from "@/features/config/routes";
import { type ExternalBook } from "@/server/db/helpers/books";
import { api } from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import { CiCirclePlus } from "react-icons/ci";

export default function LibraryDisplay() {
  const { data } = api.book.list.useQuery();

  return (
    <div className="m-auto flex flex-wrap justify-center gap-5 sm:px-10">
      <AddBookButton />
      {data?.map((book) => {
        return <Book key={book.id} book={book} />;
      })}
    </div>
  );
}

function AddBookButton() {
  return (
    <Link
      href={routes.addBook}
      className="hidden h-[300px] w-[200px] justify-center rounded-sm border-[1px] border-zinc-300 transition-all hover:bg-slate-300 focus:bg-slate-400 md:flex"
    >
      <div className="flex items-center justify-center">
        <CiCirclePlus size={30} className="mr-2" />
        Add Book
      </div>
    </Link>
  );
}

function Book({ book }: { book: ExternalBook }) {
  const owner = book.collaborators.find(({ role }) => role === "owner");
  return (
    <Link href={`/book/${book.id}`}>
      <div className="flex flex-col items-center gap-1">
        <div className="relative h-[300px] w-[200px] overflow-hidden rounded-md">
          <Image
            src={`https://platella.s3.us-east-1.amazonaws.com/${owner?.userId}/${book.images[0]}`}
            // src={`https://s3.amazonaws.com/platella/${owner?.userId}/${book.images[0]}`}
            alt={`Book ${book.title}`}
            fill
            className="object-cover"
            sizes="200px"
          />
        </div>

        <h3 className="text-xl font-semibold">{book.title}</h3>
      </div>
    </Link>
  );
}
