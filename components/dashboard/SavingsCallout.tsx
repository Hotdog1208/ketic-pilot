import { formatCurrency, formatPercent } from "@/lib/format";

type Props = {
  annualSavings: number;
  annualWaste: number;
};

export function SavingsCallout({ annualSavings, annualWaste }: Props) {
  const pct = annualWaste > 0 ? (annualSavings / annualWaste) * 100 : 0;
  return (
    <section className="animate-card-in [animation-delay:200ms]">
      <div className="grid grid-cols-12 items-stretch gap-0 rounded-md border border-border-subtle bg-bg-surface">
        <div className="col-span-7 px-8 py-12">
          <div className="text-label uppercase text-text-muted">
            With KETIC installed
          </div>
          <div className="mt-5 text-headline tnum text-data-save">
            {formatCurrency(annualSavings)} / year saved
          </div>
          <div className="mt-3 text-body text-text-muted">
            {formatPercent(pct, 0)} of current waste — modelled from your PMS data
          </div>
        </div>
        <div className="col-span-5 border-l border-border-subtle px-8 py-12 text-body text-text-muted">
          This estimate is built from check-out and check-in timestamps in your
          property management system. Hardware install converts these estimates
          to live, measured savings within 30 days.
        </div>
      </div>
    </section>
  );
}
