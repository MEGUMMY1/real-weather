import { QueryProvider } from "./providers/QueryProvider";
import { AppRouter } from "./router/index";

export const App = () => {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
};
