import { LeagueTabs } from "@/components/clubs/league-tabs";

export function HomePage() {
  return (
    <div className="flex w-full flex-col items-center gap-6 px-4 sm:px-6 md:px-10">
      <LeagueTabs />
    </div>
  );
}
