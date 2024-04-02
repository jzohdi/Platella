import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import Image from "next/image";
import type { PropsWithChildren } from "react";
import AppLink from "../components/Link";

function makeName(name?: string | null) {
  if (!name) {
    return "U";
  }
  return name
    .split(" ")
    .map((n) => n.slice(0, 1).toUpperCase())
    .join("");
}

export default function Layout({ children }: PropsWithChildren) {
  const { data: sessionData } = useSession();
  return (
    <div className="flex h-screen flex-col justify-between">
      <div className="flex h-[66px] w-full items-center justify-between border-b-2 border-b-zinc-500 p-3">
        <div className="flex items-center gap-3">
          <Image
            src="/iconx/android-48x48.png"
            width={32}
            height={32}
            alt="logo"
          />
          <h1 className="text-xl">Platella</h1>
        </div>
        <div className="flex items-center gap-3">
          <AppLink classNames="invisible md:visible" href="/">
            Library
          </AppLink>
          <Avatar>
            <AvatarFallback>{makeName(sessionData?.user.name)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <ScrollArea>
        <div className="max-w-[1200px] px-3">{children}</div>
      </ScrollArea>
      <div className="flex h-[100px] md:hidden">
        <div className="flex-1">1</div>
        <div className="flex-1">2</div>
        <div className="flex-1">3</div>
      </div>
    </div>
  );
}
