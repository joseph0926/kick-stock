import React from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@kickstock/ui/src/components/ui/sheet";
import { LogIn, Menu } from "lucide-react";
import { NAVBAR } from "@kickstock/shared/src/constants/navbar";
import { NavbarAuth } from "./navbar-auth";
import { ThemeToggle } from "@kickstock/ui/src/components/theme-toggle";
import { Button } from "@kickstock/ui/src/components/ui/button";
import { Link } from "react-router";
import { ROUTER } from "@kickstock/shared/src/constants/router";

export const NavbarMobile = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className="block md:hidden">
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-between">
        <div>
          <SheetHeader>
            <SheetTitle>KickStock</SheetTitle>
            <SheetDescription>
              축구 결과를 이용한 가상의 주식 웹 애플리케이션입니다.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 py-4 pt-10">
            <span>{NAVBAR.LEAGUE.label}</span>
            <span>{NAVBAR.COMMUNITY.label}</span>
            <span>{NAVBAR.MY.label}</span>
          </div>
        </div>
        <SheetFooter className="flex w-full flex-row items-center justify-around">
          <Link to={ROUTER.SIGNIN} className="flex flex-col items-center gap-1">
            <Button variant="ghost">
              <LogIn className="size-4" />
            </Button>
            <span className="text-sm font-medium">로그인</span>
          </Link>
          <ThemeToggle />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
