import Image from "next/image";
import AppLink from "../../components/AppLink";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

function makeName(name?: string | null) {
  if (!name) {
    return "U";
  }
  return name
    .split(" ")
    .map((n) => n.slice(0, 1).toUpperCase())
    .join("");
}

export default function AppBar() {
  const { data: sessionData } = useSession();
  return (
    <div className="flex h-[66px] w-full items-center justify-between border-b-2 border-b-zinc-500 p-3">
      <div className="flex items-center gap-2">
        <Image
          src="/iconx/android-48x48.png"
          width={28}
          height={28}
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
  );
}
