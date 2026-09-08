"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { listHostedZoneFilterOptions } from "@/features/route53/api/hosted-zones-api";
import { PropertyFilterDropdown } from "@/features/route53/components/property-filter-dropdown";
import {
  FILTER_PROPERTIES,
  type FilterProperty,
  type FilterToken,
} from "@/features/route53/data/filter-properties";
import { CloseIcon, SearchIcon } from "@/shared/icons";

type Props = {
  tokens: FilterToken[];
  onTokensChange: (tokens: FilterToken[]) => void;
  onFreeTextSearch: (query: string) => void;
};

export function HostedZonesPropertyFilter({
  tokens,
  onTokensChange,
  onFreeTextSearch,
}: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [activeProperty, setActiveProperty] = useState<FilterProperty | null>(
    null,
  );
  const [optionsMap, setOptionsMap] = useState<Record<string, string[]>>({});
  const [values, setValues] = useState<string[]>([]);
  const [valuesLoading, setValuesLoading] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const mode = activeProperty ? "values" : "properties";

  const filteredProperties = useMemo(() => {
    const q = text.trim().toLowerCase();
    if (!q) return FILTER_PROPERTIES;
    return FILTER_PROPERTIES.filter((p) => p.label.toLowerCase().includes(q));
  }, [text]);

  const filteredValues = useMemo(() => {
    if (!activeProperty) return [];
    const q = text.trim().toLowerCase();
    if (!q) return values;
    return values.filter((v) => v.toLowerCase().includes(q));
  }, [activeProperty, text, values]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setValuesLoading(true);
    listHostedZoneFilterOptions()
      .then((options) => {
        if (!active) return;
        setOptionsMap(options);
      })
      .catch(() => {
        if (active) setOptionsMap({});
      })
      .finally(() => {
        if (active) setValuesLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!activeProperty) {
      setValues([]);
      return;
    }
    setValues(optionsMap[activeProperty.key] ?? []);
  }, [activeProperty, optionsMap]);

  useEffect(() => {
    setHighlight(0);
  }, [mode, filteredProperties, filteredValues, open]);

  function selectProperty(property: FilterProperty) {
    setActiveProperty(property);
    setText("");
    setOpen(true);
    inputRef.current?.focus();
  }

  function addToken(property: FilterProperty, value: string) {
    const next: FilterToken = {
      id: `${property.key}-${value}-${Date.now()}`,
      propertyKey: property.key,
      propertyLabel: property.label,
      operator: property.operator,
      value,
    };
    onTokensChange([
      ...tokens.filter((t) => t.propertyKey !== property.key),
      next,
    ]);
    setActiveProperty(null);
    setText("");
    setOpen(false);
    onFreeTextSearch("");
  }

  function removeToken(id: string) {
    onTokensChange(tokens.filter((t) => t.id !== id));
  }

  function clearActive() {
    setActiveProperty(null);
    setText("");
    onFreeTextSearch("");
  }

  function commitFreeText() {
    const q = text.trim();
    if (activeProperty && q) {
      addToken(activeProperty, q);
      return;
    }
    if (!activeProperty) {
      onFreeTextSearch(q);
      setOpen(false);
    }
  }

  const optionCount =
    mode === "properties"
      ? filteredProperties.length
      : 1 + filteredValues.length;

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, Math.max(optionCount - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (!open) {
        commitFreeText();
        return;
      }
      if (mode === "properties") {
        const prop = filteredProperties[highlight];
        if (prop) selectProperty(prop);
        else commitFreeText();
      } else if (activeProperty) {
        if (highlight === 0) commitFreeText();
        else {
          const value = filteredValues[highlight - 1];
          if (value) addToken(activeProperty, value);
          else commitFreeText();
        }
      }
    } else if (e.key === "Escape") {
      if (activeProperty) clearActive();
      else setOpen(false);
    } else if (e.key === "Backspace" && !text && activeProperty) {
      clearActive();
    } else if (
      e.key === "Backspace" &&
      !text &&
      !activeProperty &&
      tokens.length
    ) {
      removeToken(tokens[tokens.length - 1].id);
    }
  }

  return (
    <div ref={rootRef} className="relative w-full min-w-0 max-w-[640px]">
      {tokens.length > 0 ? (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {tokens.map((token) => (
            <span
              key={token.id}
              className="inline-flex max-w-full items-center gap-1 rounded-full border border-border-strong bg-surface py-0.5 pl-2.5 pr-1 text-[13px] leading-5 text-foreground"
            >
              <span className="truncate">
                <span className="font-bold">
                  {token.propertyLabel} {token.operator}
                </span>{" "}
                {token.value}
              </span>
              <button
                type="button"
                aria-label={`Remove ${token.propertyLabel} filter`}
                onClick={() => removeToken(token.id)}
                className="flex h-5 w-5 items-center justify-center rounded-full text-muted-2 hover:bg-pill-active"
              >
                <CloseIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div
        className={`relative flex h-8 items-center overflow-hidden rounded-[8px] border bg-surface ${
          open ? "border-aws-blue" : "border-border-strong"
        }`}
      >
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-3" />
        <div className="flex min-w-0 flex-1 items-center overflow-hidden py-0 pl-9 pr-2">
          {activeProperty ? (
            <span className="shrink-0 text-[14px] font-bold leading-5 text-foreground">
              {activeProperty.label} {activeProperty.operator}&nbsp;
            </span>
          ) : null}
          <input
            ref={inputRef}
            aria-label="Filter records by property or value"
            aria-controls={listId}
            aria-expanded={open}
            placeholder={
              activeProperty ? "" : "Filter records by property or value"
            }
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setOpen(true);
              if (!activeProperty) onFreeTextSearch("");
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="h-8 min-w-0 flex-1 bg-transparent text-[14px] leading-5 text-foreground outline-none placeholder:italic placeholder:text-placeholder"
          />
          {text || activeProperty ? (
            <button
              type="button"
              aria-label="Clear filter input"
              onClick={() => {
                clearActive();
                setOpen(true);
                inputRef.current?.focus();
              }}
              className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-3 hover:bg-pill-active hover:text-foreground"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {open ? (
        <PropertyFilterDropdown
          mode={mode}
          activeProperty={activeProperty}
          properties={filteredProperties}
          values={filteredValues}
          valuesLoading={valuesLoading}
          text={text}
          highlight={highlight}
          listId={listId}
          onHighlight={setHighlight}
          onSelectProperty={(property) =>
            selectProperty(property as FilterProperty)
          }
          onSelectValue={(value) => {
            if (activeProperty) addToken(activeProperty, value);
          }}
          onUseTyped={commitFreeText}
        />
      ) : null}
    </div>
  );
}
