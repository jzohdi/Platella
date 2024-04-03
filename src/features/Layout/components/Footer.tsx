import { type ReactNode } from "react";

export type FooterProps = {
  FooterElements: ((props: { className: string }) => ReactNode)[];
};

export default function Footer({ FooterElements }: FooterProps) {
  return (
    <div className="flex h-[100px] md:hidden">
      {FooterElements.map((Element, i) => {
        return <Element className="flex-1" key={i} />;
      })}
    </div>
  );
}
