import React from "react";
import { cn } from "@kickstock/ui/src/lib/utils";
import { NavbarAuth } from "../../client/layouts/navbar-auth";
import { NavbarClient } from "../../client/layouts/navbar.client";
import { NavbarMobile } from "../../client/layouts/navbar.mobile";
import { Link } from "react-router";
import { ROUTER } from "@kickstock/shared/src/constants/router";

export function NavbarServer({ className }: { className?: string }) {
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
      <NavbarClient />
      <NavbarAuth />
      <NavbarMobile />
    </div>
  );
}
