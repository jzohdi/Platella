import { ScrollArea } from "@/components/ui/scroll-area";
import type { PropsWithChildren } from "react";
import Footer, { type FooterProps } from "./components/Footer";
import AppBar from "./components/AppBar";
import { signIn, signOut, useSession } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

type LayoutProps = FooterProps;

export default function Layout({
  children,
  footerELements,
}: PropsWithChildren<LayoutProps>) {
  const { data, status } = useSession();

  if (!data && status !== "loading") {
    signIn().catch((e) => {
      console.log("could not sign in", e);
    });
    return <div></div>;
  }
  return (
    <div className="flex h-screen flex-col justify-between">
      <AppBar />
      <ScrollArea className="flex-grow">
        <div className="m-auto max-w-[1200px] px-3">{!!data && children}</div>
      </ScrollArea>
      <Footer footerELements={footerELements} />
      <Toaster />
    </div>
  );
}
