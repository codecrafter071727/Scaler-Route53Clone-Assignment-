"use client";

import { useState } from "react";
import {
  footerLinks,
  navSections,
  topLinks,
  type NavLink,
} from "@/features/route53/data/nav-data";
import { CaretDown, ChevronLeft, ExternalLinkIcon } from "@/shared/icons";

type SideNavProps = {
  onClose: () => void;
};

const ROW =
  "grid w-full grid-cols-[20px_minmax(0,1fr)] items-center gap-x-0.5 rounded-sm py-[6px] pr-2 text-left hover:text-[#006ce0]";

export function SideNav({ onClose }: SideNavProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navSections.map((s) => [s.title, true])),
  );

  function toggleSection(title: string) {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col border-r border-[#d5dbdb] bg-white text-[14px] leading-5">
      <div className="group grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-x-0.5 pl-2 pr-2 pb-1 pt-3">
        <span aria-hidden />
        <span className="text-[18px] font-bold leading-[22px] text-[#0f141a] group-hover:text-[#006ce0]">
          Route 53
        </span>
        <button
          type="button"
          aria-label="Close side navigation"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded text-[#545b64] group-hover:text-[#006ce0]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <nav
        aria-label="Side Navigation"
        className="flex flex-1 flex-col overflow-y-auto pb-2 pl-2 pr-1"
      >
        <ul>
          {topLinks.map((link) => (
            <li key={link.label}>
              <TextRow link={link} />
            </li>
          ))}
        </ul>

        {navSections.map((section) => {
          const expanded = openSections[section.title] ?? true;
          return (
            <div key={section.title}>
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                aria-expanded={expanded}
                className={`${ROW} items-center text-[16px] font-bold leading-none text-[#0f141a] hover:text-[#006ce0]`}
              >
                <span
                  className={`flex h-4 w-5 items-center justify-center transition-transform ${
                    expanded ? "" : "-rotate-90"
                  }`}
                >
                  <CaretDown className="h-3.5 w-3.5" />
                </span>
                <span className="truncate leading-none">{section.title}</span>
              </button>
              {expanded && (
                <ul>
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <TextRow link={item} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}

        <div className="mt-auto border-t border-[#d5dbdb] bg-white pt-6 pb-3">
          <ul className="flex flex-col gap-3 pl-[28px] pr-2">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href ?? "#"}
                  className="group inline-flex items-center gap-1.5 whitespace-nowrap text-[14px] leading-5 font-normal text-[#424650] hover:text-[#006ce0]"
                >
                  <span>{link.label}</span>
                  <ExternalLinkIcon className="h-3 w-3 shrink-0 text-[#424650] group-hover:text-[#006ce0]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}

function TextRow({ link }: { link: NavLink }) {
  const color = link.active
    ? "font-bold text-[#006ce0]"
    : "font-normal text-[#424650]";

  return (
    <a
      href={link.href ?? "#"}
      className={`group ${ROW} text-[14px] ${color} hover:text-[#006ce0]`}
    >
      <span aria-hidden />
      <span className="flex min-w-0 items-center gap-1">
        <span className="truncate">{link.label}</span>
        {link.badge === "New" && (
          <span className="shrink-0 text-[12px] font-normal text-[#006ce0] underline decoration-dashed underline-offset-2">
            New
          </span>
        )}
      </span>
    </a>
  );
}
