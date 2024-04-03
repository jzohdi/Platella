import { IoLibraryOutline } from "react-icons/io5";
import Spacer from "../components/Spacer";
import LibraryDisplay from "./components/LibraryDisplay";

export default function Library() {
  return (
    <div className="py-5">
      <div className="flex items-center justify-center gap-1">
        <IoLibraryOutline size={30} />
        <h2 className="text-center text-[24px]">Library</h2>
      </div>
      <Spacer size={20} />
      <LibraryDisplay />
    </div>
  );
}
