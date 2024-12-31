import React from "react";
import { cn } from "@kickstock/ui/src/lib/utils";
import { NavbarAuth } from "../../client/layouts/navbar-auth";
import { NavbarClient } from "../../client/layouts/navbar.client";

export function NavbarServer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex w-full items-center justify-between bg-white/25 px-6 dark:bg-black/25 md:px-12",
        className,
      )}
    >
      <h1 className="text-3xl font-bold">
        <span className="text-primary">Kick</span>Stock
      </h1>
      <NavbarClient />
      <NavbarAuth />
    </div>
  );
}
