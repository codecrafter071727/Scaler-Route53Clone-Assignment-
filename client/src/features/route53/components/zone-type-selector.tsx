type ZoneType = "public" | "private";

type ZoneTypeSelectorProps = {
  value: ZoneType;
  onChange: (value: ZoneType) => void;
};

const OPTIONS: {
  id: ZoneType;
  title: string;
  description: string;
}[] = [
  {
    id: "public",
    title: "Public hosted zone",
    description: "A public hosted zone determines how traffic is routed on the internet.",
  },
  {
    id: "private",
    title: "Private hosted zone",
    description:
      "A private hosted zone determines how traffic is routed within an Amazon VPC.",
  },
];

export function ZoneTypeSelector({ value, onChange }: ZoneTypeSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Hosted zone type"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {OPTIONS.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={`flex min-h-[76px] items-start gap-3 rounded-[8px] border-2 px-4 py-3 text-left ${
              selected
                ? "border-aws-blue bg-info"
                : "border-border bg-surface hover:bg-table-hover"
            }`}
          >
            <span
              className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                selected ? "border-aws-blue" : "border-border-strong"
              }`}
            >
              {selected && <span className="h-2.5 w-2.5 rounded-full bg-aws-blue" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold leading-5 text-foreground">
                {option.title}
              </span>
              <span className="mt-0.5 block text-[13px] leading-5 text-muted-2">
                {option.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
