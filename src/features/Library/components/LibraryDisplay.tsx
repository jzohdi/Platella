import { Button } from "@/components/ui/button";
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
    <Button
      variant="outline"
      className="hidden h-[300px] w-[200px] md:inline-block"
    >
      <CiCirclePlus size={30} className="mr-2" />
      Add Book
    </Button>
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
