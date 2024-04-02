import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

type AppLinkProps = {
  href: string;
  classNames?: string;
};
export default function AppLink({
  href,
  classNames,
  children,
}: PropsWithChildren<AppLinkProps>) {
  const router = useRouter();

  return (
    <Link
      className={cn(
        "rounded-sm border-b-2 px-4 py-2 duration-200 ease-in-out hover:bg-zinc-100",
        router.pathname === href
          ? "border-b-indigo-600 text-indigo-600"
          : "border-b-white",
        classNames,
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
