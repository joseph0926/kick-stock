import React, { useState } from "react";
import { NAVBAR, leagueItems } from "@kickstock/shared/src/constants/navbar";
import { Menu, MenuItem, HoveredLink, ProductItem } from "./navbar-menu";

export const NavbarMenuWrapper = () => {
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
            title="팬 토론방"
            href="#"
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            description="다양한 축구 팬들과 실시간으로 소통하며 팀과 선수 정보를 나누어 보세요."
          />
          <ProductItem
            title="라이브 경기 분석"
            href="#"
            src="https://images.unsplash.com/photo-1589487391730-58f20eb2c308?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            description="경기 중 실시간 분석을 통해 각 팀의 전략과 선수 활약을 함께 예측해 보세요."
          />
          <ProductItem
            title="팀 토론방"
            href="#"
            src="https://images.unsplash.com/photo-1598881034666-6d3443d4b1bc?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            description="본인이 응원하는 팀의 팬들끼리 서로 소통해보세요."
          />
          <ProductItem
            title="주가 예측 토론"
            href="#"
            src="https://images.unsplash.com/photo-1560221328-12fe60f83ab8?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            description="선수와 팀의 주식 가치 변동을 함께 토론하며 더 나은 투자 전략을 세워보세요."
          />
        </div>
      </MenuItem>
      <MenuItem setActive={setActive} active={active} item={NAVBAR.MY.label}>
        <div className="flex flex-col space-y-4 text-sm">
          <HoveredLink href="/mypage/profile">내 정보</HoveredLink>
          <HoveredLink href="/mypage/portfolio">나의 포트폴리오</HoveredLink>
          <HoveredLink href="/mypage/trade-history">거래 내역</HoveredLink>
          <HoveredLink href="/mypage/favorites">관심 선수/팀</HoveredLink>
        </div>
      </MenuItem>
    </Menu>
  );
};
