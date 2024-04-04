import { type ReactNode } from "react";
import getFooterActionBroker, {
  type FooterAction,
} from "../hooks/useFooterActions";
import { Button } from "@/components/ui/button";
import VisibleSmall from "@/features/components/Breakpoints/VisibleSmall";

export type FooterProps = {
  footerELements: FooterElement[];
};

export type FooterElement = {
  display: ReactNode;
  action: FooterAction;
};

const broker = getFooterActionBroker();

export default function Footer({ footerELements }: FooterProps) {
  return (
    <VisibleSmall className="flex h-16">
      {footerELements.map((config) => {
        return (
          <Button
            variant="outline"
            className="h-full flex-grow"
            key={config.action}
            onClick={() => broker.notify(config.action)}
          >
            {config.display}
          </Button>
        );
      })}
    </VisibleSmall>
  );
}
