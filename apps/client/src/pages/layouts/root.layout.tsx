import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <div className="w-full min-h-screen bg-background-transparent flex items-center">
      <Outlet />
    </div>
  );
}
