import React from "react";
import { Outlet } from "react-router";
import { Logo } from "../shared/logo";
import { Card, CardContent } from "@kickstock/ui/src/components/ui/card";
import { SocialAuthForm } from "../auth/social-auth-form";

export const AuthLayout = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 bg-cover bg-center bg-no-repeat px-4 py-10 dark:bg-slate-900">
      <Card className="w-full p-4 sm:w-[520px] sm:p-8">
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-2.5">
              <h1 className="scroll-m-20 text-2xl font-bold tracking-tight dark:text-slate-50">
                KickStock 로그인
              </h1>
            </div>
            <Logo withLabel={false} className="size-12" />
          </div>
          <Outlet />
          <SocialAuthForm />
        </CardContent>
      </Card>
    </main>
  );
};
