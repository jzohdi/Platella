import { Button } from "@/components/ui/button";
import { CiCirclePlus } from "react-icons/ci";
import { RxStarFilled } from "react-icons/rx";
type ElementProps = { className: string };

function AddButton({ className }: ElementProps) {
  return (
    <Button variant="outline" className={className}>
      <CiCirclePlus size={30} />
    </Button>
  );
}

function FavoriteButton({ className }: ElementProps) {
  return (
    <Button variant="outline" className={className}>
      <RxStarFilled />
    </Button>
  );
}

export const LibraryFooterElements = [FavoriteButton, AddButton];
