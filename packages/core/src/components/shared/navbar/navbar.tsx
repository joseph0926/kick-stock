import React from "react";
import { cn } from "@kickstock/ui/src/lib/utils";
import { Link } from "react-router";
import { ROUTER } from "@kickstock/shared/src/constants/router";
import { NavbarAuth } from "./navbar-auth";
import { NavbarMobile } from "./navbar.mobile";
import { NavbarMenuWrapper } from "./navbar-menu-wrapper";

export function Navbar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex w-full items-center justify-between bg-white/25 px-6 dark:bg-black/25 max-md:py-4 md:px-12",
        className,
      )}
    >
      <Link to={ROUTER.HOME} className="text-3xl font-bold">
        <span className="text-primary">Kick</span>Stock
      </Link>
      <NavbarMenuWrapper />
      <NavbarAuth />
      <NavbarMobile />
    </div>
  );
}
