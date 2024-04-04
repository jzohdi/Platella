import { type ReactNode } from "react";
import getFooterActionBroker, {
  type FooterAction,
} from "../hooks/useFooterActions";
import { Button } from "@/components/ui/button";

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
    <div className="flex h-16 md:hidden">
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
    </div>
  );
}
