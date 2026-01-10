import { QueryProvider } from "./providers/QueryProvider";
import { ModalProvider } from "@shared/ui/ModalProvider";
import { AppRouter } from "./router/index";

export const App = () => {
  return (
    <QueryProvider>
      <ModalProvider>
        <AppRouter />
      </ModalProvider>
    </QueryProvider>
  );
};
