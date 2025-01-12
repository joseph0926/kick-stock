import React from "react";
import { Button } from "@kickstock/ui/src/components/ui/button";
import { Github } from "lucide-react";
import { GoogleIcon } from "../shared/icons";

export const SocialAuthForm = () => {
  const buttonClass =
    "background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5";

  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button className={buttonClass} onClick={() => {}}>
        <Github className="mr-2.5 !size-7 object-contain" />
        <span>GitHub 로그인</span>
      </Button>

      <Button className={buttonClass} onClick={() => {}}>
        <GoogleIcon
          className="mr-2.5 !size-8 object-contain"
          pathClassName="fill-white"
        />
        <span>Google 로그인</span>
      </Button>
    </div>
  );
};
