export type FooterAction =
  | "favorite"
  | "new"
  | "navigate_home"
  | "delete"
  | "submit";

type FooterActionListener = (payload: unknown) => void;

class FooterActionBroker {
  listeners: Map<FooterAction, Map<string, FooterActionListener>>;
  constructor() {
    this.listeners = new Map();
  }

  subscribe(id: string, action: FooterAction, listener: FooterActionListener) {
    if (!this.listeners.has(action)) {
      this.listeners.set(action, new Map());
    }
    this.listeners.get(action)?.set(id, listener);
    return id;
  }

  unsubscribe(id: string, action: FooterAction) {
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    this.listeners.get(action)?.delete(id);
  }

  notify(action: FooterAction) {
    const map = this.listeners.get(action);
    if (!map) {
      return;
    }
    for (const fn of map.values()) {
      fn(null);
    }
  }
}

let footerActionBroker: FooterActionBroker | null = null;

export default function getFooterActionBroker() {
  if (footerActionBroker === null) {
    footerActionBroker = new FooterActionBroker();
  }
  return footerActionBroker;
}
