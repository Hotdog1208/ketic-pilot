type Props = {
  propertyName: string;
  location: string;
};

export function DashboardHeader({ propertyName, location }: Props) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-border-subtle">
      <div className="text-body font-bold tracking-tight text-text-primary">
        KETIC
      </div>
      <div className="flex flex-col items-end">
        <span className="text-body text-text-primary">{propertyName}</span>
        <span className="text-micro text-text-muted">{location}</span>
      </div>
    </header>
  );
}
