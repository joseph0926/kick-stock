import React from "react";
import { cn } from "@kickstock/ui/src/lib/utils";

export const Logo = ({
  withLabel = true,
  className,
}: {
  className?: string;
  withLabel?: boolean;
}) => {
  return (
    <span
      className={cn(
        "flex items-center font-semibold leading-none text-foreground",
        className,
      )}
    >
      <svg
        height="200px"
        width="200px"
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="#000000"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <circle style={{ fill: "#FF7F4F" }} cx="256" cy="256" r="256" />
          <path
            style={{ fill: "#FF5419" }}
            d="M134.432,370.195l141.071,141.071c124.554-9.383,224.218-107.898,235.427-231.933l-140.734-140.74 L134.432,370.195z"
          />
          <path
            style={{ fill: "#45494C" }}
            d="M253.342,90.109c-91.157,0-165.922,74.162-165.317,165.317 c0.61,91.881,74.743,166.01,165.317,165.317c91.153-0.696,165.317-74.161,165.317-165.317S344.498,90.109,253.342,90.109z"
          />
          <path
            style={{ fill: "#303335" }}
            d="M253.342,420.743c91.157,0,165.317-74.161,165.317-165.317S344.498,90.109,253.342,90.109V420.743z"
          />
          <polygon
            style={{ fill: "#C6C6C6" }}
            points="374.865,152.743 317.681,152.743 289.089,202.268 317.681,251.788 374.865,251.788 403.456,202.268"
          />
          <polygon
            style={{ fill: "#E3E5E4" }}
            points="281.933,102.055 224.751,102.055 196.158,151.578 224.751,201.099 281.933,201.099 310.525,151.578"
          />
          <polygon
            style={{ fill: "#C6C6C6" }}
            points="310.525,151.578 281.933,102.055 254.564,102.055 254.564,201.099 281.933,201.099"
          />
          <polygon
            style={{ fill: "#E3E5E4" }}
            points="189.004,152.743 131.82,152.743 103.227,202.268 131.82,251.788 189.004,251.788 217.597,202.268"
          />
          <polygon
            style={{ fill: "#C6C6C6" }}
            points="374.865,358.107 317.681,358.107 289.089,308.584 317.681,259.062 374.865,259.062 403.456,308.584"
          />
          <polygon
            style={{ fill: "#E3E5E4" }}
            points="281.933,408.797 224.751,408.797 196.158,359.274 224.751,309.751 281.933,309.751 310.525,359.274"
          />
          <polygon
            style={{ fill: "#C6C6C6" }}
            points="310.525,359.274 281.933,309.751 254.564,309.751 254.564,408.797 281.933,408.797"
          />
          <polygon
            style={{ fill: "#E3E5E4" }}
            points="189.004,358.107 131.82,358.107 103.227,308.584 131.82,259.062 189.004,259.062 217.597,308.584"
          />
        </g>
      </svg>
      {withLabel && (
        <span className="ml-3 hidden text-lg md:block">KickStock</span>
      )}
    </span>
  );
};