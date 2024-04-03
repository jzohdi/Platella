import { ScrollArea } from "@/components/ui/scroll-area";
import type { PropsWithChildren } from "react";
import Footer, { type FooterProps } from "./components/Footer";
import AppBar from "./components/AppBar";

type LayoutProps = FooterProps;

export default function Layout({
  children,
  FooterElements,
}: PropsWithChildren<LayoutProps>) {
  return (
    <div className="flex h-screen flex-col justify-between">
      <AppBar />
      <ScrollArea className="flex-grow">
        <div className="max-w-[1200px] px-3">{children}</div>
      </ScrollArea>
      <Footer FooterElements={FooterElements} />
    </div>
  );
}
