"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";

// AuthHydrator a disparu : la session n'est plus lue depuis localStorage dans
// un useEffect, elle est fournie par le layout dashboard via SessionSync, avec
// le user déjà résolu côté serveur.
export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
