import { IoLibraryOutline } from "react-icons/io5";
import Spacer from "../../components/Spacer";
import LibraryDisplay from "./components/LibraryDisplay";
import { type FooterElement } from "@/features/Layout/components/Footer";
import { CiCirclePlus } from "react-icons/ci";
import { RxStarFilled } from "react-icons/rx";
import { FOOTER } from "@/features/config/constants";
import getFooterActionBroker from "@/features/Layout/hooks/useFooterActions";
import { useRouter } from "next/router";
import { useEffect } from "react";
import routes from "@/features/config/routes";
import PageHeader from "@/features/components/PageHeader";

const broker = getFooterActionBroker();

export const libraryFooterActions: FooterElement[] = [
  { action: "favorite", display: <RxStarFilled size={FOOTER.ICON_SIZE} /> },
  {
    action: "new",
    display: <CiCirclePlus size={FOOTER.ICON_SIZE} />,
  },
] as const;

export default function Library() {
  const router = useRouter();

  useEffect(() => {
    const id = "library_display";
    broker.subscribe(id, "new", () => {
      router.push(routes.addBook).catch((e) => {
        console.error("failed to route to new add book", e);
        return;
      });
    });

    return () => {
      broker.unsubscribe(id, "new");
    };
  }, [router]);

  return (
    <div className="py-5">
      <PageHeader icon={<IoLibraryOutline size={30} />} title="Library" />
      <Spacer size={20} />
      <LibraryDisplay />
    </div>
  );
}
