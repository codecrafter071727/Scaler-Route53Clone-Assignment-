"use client";

import type { FilterProperty } from "@/features/route53/data/filter-properties";

type Props = {
  mode: "properties" | "values";
  activeProperty: FilterProperty | null;
  properties: FilterProperty[];
  values: string[];
  valuesLoading: boolean;
  text: string;
  highlight: number;
  listId: string;
  onHighlight: (index: number) => void;
  onSelectProperty: (property: FilterProperty) => void;
  onSelectValue: (value: string) => void;
  onUseTyped: () => void;
};

const optionClass = (active: boolean) =>
  `mx-1 block w-[calc(100%-8px)] rounded-lg px-3 py-2 text-left text-[14px] leading-5 text-[#0f141a] ${
    active ? "bg-[#eaeded]" : "bg-transparent hover:bg-[#f2f3f3]"
  }`;

export function PropertyFilterDropdown({
  mode,
  activeProperty,
  properties,
  values,
  valuesLoading,
  text,
  highlight,
  listId,
  onHighlight,
  onSelectProperty,
  onSelectValue,
  onUseTyped,
}: Props) {
  return (
    <div
      id={listId}
      role="listbox"
      className="absolute z-30 mt-1 max-h-[320px] w-full overflow-auto rounded-[8px] border border-[#d5dbdb] bg-white py-1 shadow-[0_5px_15px_rgba(0,28,36,0.15)]"
    >
      {mode === "properties" ? (
        <>
          <div className="px-4 pb-1 pt-2 text-[14px] font-bold leading-5 text-[#0f141a]">
            Properties
          </div>
          {properties.length === 0 ? (
            <p className="px-4 py-2 text-[14px] text-[#545b64]">
              No matching properties
            </p>
          ) : (
            <div className="pb-1">
              {properties.map((prop, index) => (
                <button
                  key={prop.key}
                  type="button"
                  role="option"
                  aria-selected={highlight === index}
                  onMouseEnter={() => onHighlight(index)}
                  onClick={() => onSelectProperty(prop)}
                  className={optionClass(highlight === index)}
                >
                  {prop.label}
                </button>
              ))}
            </div>
          )}
        </>
      ) : activeProperty ? (
        <>
          <div className="pb-1 pt-1">
            <button
              type="button"
              role="option"
              aria-selected={highlight === 0}
              onMouseEnter={() => onHighlight(0)}
              onClick={onUseTyped}
              className={optionClass(highlight === 0)}
            >
              Use: {activeProperty.label} {activeProperty.operator}
              {text ? ` ${text}` : ""}
            </button>
          </div>
          <div className="px-4 pb-1 pt-1 text-[14px] font-bold leading-5 text-[#0f141a]">
            values
          </div>
          {valuesLoading ? (
            <p className="px-4 py-2 text-[14px] text-[#545b64]">Loading…</p>
          ) : values.length === 0 ? (
            <p className="px-4 py-2 text-[14px] text-[#545b64]">
              No matching values
            </p>
          ) : (
            <div className="pb-1">
              {values.map((value, index) => {
                const optionIndex = index + 1;
                const isId = activeProperty.key === "hosted_zone_id";
                return (
                  <button
                    key={`${value}-${index}`}
                    type="button"
                    role="option"
                    aria-selected={highlight === optionIndex}
                    onMouseEnter={() => onHighlight(optionIndex)}
                    onClick={() => onSelectValue(value)}
                    className={optionClass(highlight === optionIndex)}
                  >
                    {isId ? (
                      <>
                        <div className="font-bold">
                          {activeProperty.label} {activeProperty.operator}
                        </div>
                        <div className="break-all font-normal">{value}</div>
                      </>
                    ) : (
                      <>
                        {activeProperty.label} {activeProperty.operator} {value}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
