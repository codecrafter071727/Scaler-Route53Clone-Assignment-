import { MobileAppIcon, TerminalIcon, ToolboxIcon } from "@/shared/icons";

const leftItems = [
  { label: "CloudShell", icon: TerminalIcon },
  { label: "Agent Toolkit for AWS", icon: ToolboxIcon },
  { label: "Feedback" },
  { label: "Console Mobile App", icon: MobileAppIcon },
] as const;

const rightItems = ["Privacy", "Terms", "Cookie preferences"] as const;

export function ConsoleFooter() {
  return (
    <footer className="flex h-9 shrink-0 items-center justify-between gap-3 overflow-x-auto bg-chrome px-3 text-[12px] font-normal text-header-fg sm:h-[34px] sm:gap-6 sm:px-4 sm:text-[13px]">
      <ul className="hidden h-full min-w-0 items-center gap-x-6 md:flex">
        {leftItems.map((item) => {
          const Icon = "icon" in item ? item.icon : null;
          return (
            <li key={item.label} className="flex h-full items-center">
              <a
                href="#"
                className="inline-flex h-full items-center gap-1.5 whitespace-nowrap leading-none hover:text-aws-blue"
              >
                {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : null}
                <span className="leading-none">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <ul className="flex h-full min-w-0 flex-1 items-center justify-end gap-x-3 sm:gap-x-6 md:flex-none md:shrink-0">
        <li className="flex h-full items-center truncate whitespace-nowrap leading-none">
          <span className="hidden sm:inline">
            © 2026, Amazon Web Services, Inc. or its affiliates.
          </span>
          <span className="sm:hidden">© 2026 AWS</span>
        </li>
        {rightItems.map((label) => (
          <li
            key={label}
            className={`flex h-full items-center ${
              label === "Cookie preferences" ? "hidden sm:flex" : ""
            }`}
          >
            <a
              href="#"
              className="inline-flex h-full items-center whitespace-nowrap leading-none hover:text-aws-blue"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
