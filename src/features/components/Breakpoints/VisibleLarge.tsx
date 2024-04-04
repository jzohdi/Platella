import { cn } from "@/lib/utils";
import { type PropsWithChildren } from "react";

type VisibleLargeProps = {
  className?: string;
};

export default function VisibleLarge({
  children,
  className,
}: PropsWithChildren<VisibleLargeProps>) {
  return (
    <section
      aria-label="only visilbe on screens above 768px"
      className={cn("hidden md:inline-block", className)}
    >
      {children}
    </section>
  );
}
