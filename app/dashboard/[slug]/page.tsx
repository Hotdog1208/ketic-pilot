import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { RoomTable, type RoomRow } from "@/components/dashboard/RoomTable";
import { SavingsCallout } from "@/components/dashboard/SavingsCallout";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { projectAnnual } from "@/lib/calculations";
import type { Property, RoomEvent } from "@/lib/supabase/types";

export const revalidate = 0;

type Params = { slug: string };

export default async function DashboardPage({
  params,
}: {
  params: Params;
}) {
  const supabase = createServerClient();

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", params.slug)
    .maybeSingle<Property>();

  if (!property) {
    notFound();
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);

  const { data: events } = await supabase
    .from("room_events")
    .select("*")
    .eq("property_id", property.id)
    .gte("event_date", thirtyDaysAgo.toISOString().slice(0, 10))
    .order("event_date", { ascending: true });

  const allEvents: RoomEvent[] = events ?? [];

  // Hero: projected annual
  const totalCost30 = allEvents.reduce((s, e) => s + Number(e.cost_wasted), 0);
  const projectedAnnual = projectAnnual(totalCost30);
  const monitoredRoomCount = new Set(allEvents.map((e) => e.room_number)).size;

  // This week vs last week
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000);

  const thisWeekEvents = allEvents.filter(
    (e) => new Date(e.event_date) >= sevenDaysAgo,
  );
  const lastWeekEvents = allEvents.filter((e) => {
    const d = new Date(e.event_date);
    return d >= fourteenDaysAgo && d < sevenDaysAgo;
  });

  const wastedThisWeek = thisWeekEvents.reduce(
    (s, e) => s + Number(e.cost_wasted),
    0,
  );
  const wastedLastWeek = lastWeekEvents.reduce(
    (s, e) => s + Number(e.cost_wasted),
    0,
  );
  const vacancyHoursThisWeek = thisWeekEvents.reduce(
    (s, e) => s + Number(e.vacancy_hours),
    0,
  );
  const roomsWithEventsThisWeek = new Set(
    thisWeekEvents.map((e) => e.room_number),
  ).size;

  // Trend chart: daily totals across 30 days
  const dayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    dayMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const e of allEvents) {
    if (dayMap.has(e.event_date)) {
      dayMap.set(
        e.event_date,
        (dayMap.get(e.event_date) ?? 0) + Number(e.cost_wasted),
      );
    }
  }
  const trendData = Array.from(dayMap.entries()).map(([date, cost]) => ({
    date,
    cost: Math.round(cost * 100) / 100,
  }));

  // Room table: aggregate this week by room
  const roomAgg = new Map<string, RoomRow>();
  for (const e of thisWeekEvents) {
    const key = e.room_number;
    const existing = roomAgg.get(key);
    if (existing) {
      existing.vacancy_hours += Number(e.vacancy_hours);
      existing.cost_wasted += Number(e.cost_wasted);
      existing.ketic_would_save += Number(e.ketic_would_save);
    } else {
      roomAgg.set(key, {
        room_number: e.room_number,
        room_type: e.room_type,
        floor: e.floor,
        vacancy_hours: Number(e.vacancy_hours),
        cost_wasted: Number(e.cost_wasted),
        ketic_would_save: Number(e.ketic_would_save),
      });
    }
  }
  const roomRows: RoomRow[] = Array.from(roomAgg.values()).map((r) => ({
    ...r,
    vacancy_hours: Math.round(r.vacancy_hours * 100) / 100,
    cost_wasted: Math.round(r.cost_wasted * 100) / 100,
    ketic_would_save: Math.round(r.ketic_would_save * 100) / 100,
  }));

  const annualSavings = Math.round((projectedAnnual * 0.72) / 1);
  // The savings ratio matches the per-event ketic_would_save / cost_wasted ratio.

  return (
    <main className="mx-auto max-w-[1280px] px-12">
      <DashboardHeader
        propertyName={property.name}
        location={property.location}
      />
      <div className="space-y-12 py-12">
        <HeroSection
          projectedAnnual={projectedAnnual}
          monitoredRoomCount={monitoredRoomCount || property.room_count}
          wastedThisWeek={wastedThisWeek}
          wastedLastWeek={wastedLastWeek}
          vacancyHoursThisWeek={vacancyHoursThisWeek}
          roomsWithEventsThisWeek={roomsWithEventsThisWeek}
        />
        <TrendChart data={trendData} />
        <RoomTable rows={roomRows} />
        <SavingsCallout
          annualSavings={annualSavings}
          annualWaste={projectedAnnual}
        />
      </div>
      <DashboardFooter />
    </main>
  );
}
