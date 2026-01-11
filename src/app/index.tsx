import { QueryProvider } from "./providers/QueryProvider";
import { ModalProvider } from "@shared/ui/ModalProvider";
import { ToastProvider } from "@shared/ui/ToastProvider";
import { AppRouter } from "./router/index";

export const App = () => {
  return (
    <QueryProvider>
      <ModalProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </ModalProvider>
    </QueryProvider>
  );
};
