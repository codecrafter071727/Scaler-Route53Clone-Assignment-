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
    <footer className="flex h-[34px] shrink-0 items-center justify-between gap-6 bg-chrome px-4 text-[13px] font-normal text-header-fg">
      <ul className="flex h-full min-w-0 items-center gap-x-6">
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

      <ul className="flex h-full shrink-0 items-center justify-end gap-x-6">
        <li className="flex h-full items-center whitespace-nowrap leading-none">
          © 2026, Amazon Web Services, Inc. or its affiliates.
        </li>
        {rightItems.map((label) => (
          <li key={label} className="flex h-full items-center">
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
