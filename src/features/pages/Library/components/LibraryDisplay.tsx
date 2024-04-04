import routes from "@/features/config/routes";
import Link from "next/link";
import { CiCirclePlus } from "react-icons/ci";

export default function LibraryDisplay() {
  return (
    <div className="m-auto flex flex-wrap justify-center gap-5 sm:px-10">
      <AddBookButton />
      <Book />
      <Book />
      <Book />
      <Book />
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

function Book() {
  return (
    <div className="flex flex-col items-center gap-1">
      <Link href="/">
        <div className="h-[300px] w-[200px] rounded-sm bg-slate-400"></div>
      </Link>
      Book name
    </div>
  );
}
