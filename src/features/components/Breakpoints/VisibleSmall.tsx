import { cn } from "@/lib/utils";
import { type PropsWithChildren } from "react";

type VisibleSmallProps = {
  className?: string;
};

export default function VisibleSmall({
  children,
  className,
}: PropsWithChildren<VisibleSmallProps>) {
  return (
    <section
      aria-label="only visilbe on screens smaller than 768px"
      className={cn("inline-block md:hidden", className)}
    >
      {children}
    </section>
  );
}
