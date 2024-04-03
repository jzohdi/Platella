class FooterActionBroker {}

let footerActionBroker: FooterActionBroker | null = null;

export default function useFooterActions() {
  if (footerActionBroker === null) {
    footerActionBroker = new FooterActionBroker();
  }
  return footerActionBroker;
}
