"use client";

import React, { useState } from "react";
import { NAVBAR, leagueItems } from "@kickstock/shared/src/constants/navbar";
import { Menu, MenuItem, HoveredLink, ProductItem } from "./navbar-menu";

export const NavbarClient = () => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Menu setActive={setActive}>
      <MenuItem
        setActive={setActive}
        active={active}
        item={NAVBAR.LEAGUE.label}
      >
        <div className="flex flex-col space-y-4 text-sm">
          {leagueItems.map((item) => (
            <HoveredLink key={item.href} to={item.href}>
              {item.label}
            </HoveredLink>
          ))}
        </div>
      </MenuItem>
      <MenuItem
        setActive={setActive}
        active={active}
        item={NAVBAR.COMMUNITY.label}
      >
        <div className="grid grid-cols-2 gap-10 p-4 text-sm">
          <ProductItem
            title="Algochurn"
            href="https://algochurn.com"
            src="https://assets.aceternity.com/demos/algochurn.webp"
            description="Prepare for tech interviews like never before."
          />
          <ProductItem
            title="Tailwind Master Kit"
            href="https://tailwindmasterkit.com"
            src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
            description="Production ready Tailwind css components for your next project"
          />
          <ProductItem
            title="Moonbeam"
            href="https://gomoonbeam.com"
            src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
            description="Never write from scratch again. Go from idea to blog in minutes."
          />
          <ProductItem
            title="Rogue"
            href="https://userogue.com"
            src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
            description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
          />
        </div>
      </MenuItem>
      <MenuItem setActive={setActive} active={active} item={NAVBAR.MY.label}>
        <div className="flex flex-col space-y-4 text-sm">
          <HoveredLink href="/hobby">Hobby</HoveredLink>
          <HoveredLink href="/individual">Individual</HoveredLink>
          <HoveredLink href="/team">Team</HoveredLink>
          <HoveredLink href="/enterprise">Enterprise</HoveredLink>
        </div>
      </MenuItem>
    </Menu>
  );
};