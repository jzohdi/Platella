import { type ReactNode } from "react";

type PageHeaderProps = {
  icon: ReactNode;
  title: string;
};

export default function PageHeader({ icon, title }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      {icon}
      <h2 className="text-center text-[24px]">{title}</h2>
    </div>
  );
}
