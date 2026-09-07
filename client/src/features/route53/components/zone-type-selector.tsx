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
      className="flex max-w-4xl flex-col overflow-hidden rounded-xl border border-[#d5dbdb] sm:flex-row"
    >
      {OPTIONS.map((option, index) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={`flex min-w-0 flex-1 items-start gap-3 px-4 py-3.5 text-left ${
              selected ? "bg-[#f2f8fd] outline outline-2 outline-[#006ce0] -outline-offset-2" : "bg-white"
            } ${index === 0 ? "sm:border-r sm:border-[#d5dbdb]" : ""}`}
          >
            <span
              className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                selected ? "border-[#006ce0]" : "border-[#7d8998]"
              }`}
            >
              {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#006ce0]" />}
            </span>
            <span>
              <span className="block text-[14px] font-bold leading-5 text-[#0f141a]">
                {option.title}
              </span>
              <span className="mt-0.5 block text-[14px] leading-5 text-[#545b64]">
                {option.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
