import React from "react";
import { LogIn } from "lucide-react";
import { Link } from "react-router";
import { ROUTER } from "@kickstock/shared/src/constants/router";
import { Button } from "@kickstock/ui/src/components/ui/button";
import { ThemeToggle } from "@kickstock/ui/src/components/theme-toggle";

export const NavbarAuth = () => {
  return (
    <div className="hidden h-full items-center gap-4 md:flex">
      <Link to={ROUTER.SIGNIN} className="flex flex-col items-center gap-1">
        <Button variant="ghost">
          <LogIn className="size-4" />
        </Button>
        <span className="text-sm font-medium">로그인</span>
      </Link>
      <ThemeToggle />
    </div>
  );
};
