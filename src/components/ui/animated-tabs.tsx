"use client";

import { useId } from "react";
import { LayoutGroup, motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface AnimatedTab {
  id: string;
  label: string;
  /** Optional small count shown after the label */
  count?: number | string;
}

interface AnimatedTabsProps {
  tabs: AnimatedTab[];
  value: string;
  onChange: (tabId: string) => void;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

/**
 * Pill tabs with a "bubble" that slides between the active tab (21st.dev builduilabs/animated-tabs),
 * adapted to the site's ink / paper pills: controlled, with counts and a solid ink bubble.
 */
export function AnimatedTabs({ tabs, value, onChange, disabled, className, ...rest }: AnimatedTabsProps) {
  const bubbleId = useId();
  return (
    <LayoutGroup id={bubbleId}>
    <div
      role="tablist"
      aria-label={rest["aria-label"]}
      className={cn("flex w-fit max-w-full overflow-x-auto rounded-sm border border-ink text-ink", className)}
    >
      {tabs.map((tab, idx) => {
        const active = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={disabled}
            onClick={() => onChange(tab.id)}
            style={{ WebkitTapHighlightColor: "transparent" }}
            className={cn(
              "relative inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap px-4 text-sm font-medium outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink/50 disabled:opacity-50",
              idx > 0 && "border-l border-ink",
              active ? "text-paper" : "text-ink hover:bg-ink/10",
            )}
          >
            {active && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 bg-ink"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "relative z-10 text-xs tabular-nums transition-colors duration-300",
                  active ? "text-paper/70" : "text-ink/50",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
    </LayoutGroup>
  );
}
