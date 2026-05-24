import { Card } from "@/components/ui/Card";
import { formatCurrency, formatHours, formatPercent } from "@/lib/format";
import { cn } from "@/lib/cn";

type Props = {
  projectedAnnual: number;
  monitoredRoomCount: number;
  wastedThisWeek: number;
  wastedLastWeek: number;
  vacancyHoursThisWeek: number;
  roomsWithEventsThisWeek: number;
};

export function HeroSection({
  projectedAnnual,
  monitoredRoomCount,
  wastedThisWeek,
  wastedLastWeek,
  vacancyHoursThisWeek,
  roomsWithEventsThisWeek,
}: Props) {
  const pctChange =
    wastedLastWeek > 0
      ? ((wastedThisWeek - wastedLastWeek) / wastedLastWeek) * 100
      : null;
  const isUp = pctChange !== null && pctChange >= 0;

  return (
    <section className="grid grid-cols-12 gap-6">
      <Card padding="lg" className="col-span-7 animate-card-in [animation-delay:0ms]">
        <div className="text-label uppercase text-text-muted">
          Projected annual waste
        </div>
        <div className="mt-6 text-display tnum text-accent-amber">
          {formatCurrency(projectedAnnual)}
        </div>
        <div className="mt-4 text-micro text-text-muted">
          extrapolated from last 30 days across {monitoredRoomCount} rooms
        </div>
      </Card>

      <div className="col-span-5 flex flex-col gap-6">
        <Card padding="lg" className="animate-card-in [animation-delay:40ms]">
          <div className="text-label uppercase text-text-muted">
            Wasted this week
          </div>
          <div className="mt-4 text-headline tnum text-text-primary">
            {formatCurrency(wastedThisWeek)}
          </div>
          {pctChange !== null && (
            <div className="mt-3">
              <TrendPill isUp={isUp} change={pctChange} />
            </div>
          )}
        </Card>
        <Card padding="lg" className="animate-card-in [animation-delay:80ms]">
          <div className="text-label uppercase text-text-muted">
            Vacancy hours this week
          </div>
          <div className="mt-4 text-headline tnum text-text-primary">
            {formatHours(vacancyHoursThisWeek)}
          </div>
          <div className="mt-3 text-micro text-text-muted">
            across {roomsWithEventsThisWeek} rooms
          </div>
        </Card>
      </div>
    </section>
  );
}

function TrendPill({ isUp, change }: { isUp: boolean; change: number }) {
  const arrow = isUp ? "↑" : "↓";
  const color = isUp ? "#E5484D" : "#2BD17E";
  const bg = isUp ? "rgba(229,72,77,0.10)" : "rgba(43,209,126,0.10)";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-micro font-medium tnum",
      )}
      style={{ color, backgroundColor: bg }}
    >
      <span aria-hidden>{arrow}</span>
      <span>
        {formatPercent(Math.abs(change), 0)} vs last week
      </span>
    </span>
  );
}
