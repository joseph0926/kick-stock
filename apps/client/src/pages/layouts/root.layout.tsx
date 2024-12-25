import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <div className="flex min-h-screen w-full items-center bg-background-transparent">
      <Outlet />
    </div>
  );
}
