import { RouterProvider } from "react-router";
import { router } from "@/router";
import { ThemeProvider } from "./context/theme.context";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
