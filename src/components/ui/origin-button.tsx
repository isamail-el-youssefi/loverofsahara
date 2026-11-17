"use client";

import { motion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:var(--paper)] [--ic-foreground:var(--ink)] [--ic-primary:var(--ink)] [--ic-secondary:var(--color-neutral-600)] [--ic-surface-border:var(--color-neutral-200)] [--ic-border:var(--color-neutral-200)] [--ic-card:var(--paper)] [--ic-card-foreground:var(--ink)] [--ic-muted:var(--color-neutral-100)] [--ic-muted-foreground:var(--color-neutral-500)] [--ic-accent:var(--color-neutral-100)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:var(--ink)] [--ic-input:var(--color-neutral-200)] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:var(--paper)] [--ic-popover-foreground:var(--ink)] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)]";

const FILL_DURATION = 0.5;
const FILL_EASE = [0.16, 1, 0.3, 1] as const;

function getCoverDiameter(width: number, height: number, x: number, y: number) {
  return Math.ceil(
    2 *
      Math.max(
        Math.hypot(x, y),
        Math.hypot(width - x, y),
        Math.hypot(x, height - y),
        Math.hypot(width - x, height - y)
      )
  );
}

export type OriginButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children?: React.ReactNode;
    loading?: boolean;
    href?: string;
    fillClassName?: string;
    variant?: "default" | "white" | "dark" | "outline";
  };

const OriginButton = React.forwardRef<HTMLElement, OriginButtonProps>(
  (
    {
      children,
      className,
      disabled = false,
      loading = false,
      type = "button",
      href,
      fillClassName,
      variant = "default",
      onBlur,
      onClick,
      onFocus,
      onKeyDown,
      onKeyUp,
      onPointerCancel,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      onPointerUp,
      ...props
    },
    ref
  ) => {
    const elementRef = React.useRef<HTMLElement | null>(null);
    const isDisabled = Boolean(disabled || loading);
    const [hovered, setHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);
    const [origin, setOrigin] = React.useState({ x: 0, y: 0 });
    const [coverSize, setCoverSize] = React.useState(0);

    const isWhiteFill =
      variant === "white" || (fillClassName && fillClassName.includes("bg-white"));

    const updateOrigin = React.useCallback((x: number, y: number) => {
      const node = elementRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      setOrigin({ x, y });
      setCoverSize(getCoverDiameter(rect.width, rect.height, x, y));
    }, []);

    const updateOriginFromPointer = React.useCallback(
      (event: React.PointerEvent<HTMLElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        updateOrigin(event.clientX - rect.left, event.clientY - rect.top);
      },
      [updateOrigin]
    );

    const updateOriginFromCenter = React.useCallback(() => {
      const node = elementRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      updateOrigin(rect.width / 2, rect.height / 2);
    }, [updateOrigin]);

    const showFill = !isDisabled && (hovered || isPressed);

    React.useLayoutEffect(() => {
      const node = elementRef.current;
      if (!(node && showFill)) return;

      const measure = () => {
        const rect = node.getBoundingClientRect();
        setCoverSize(
          getCoverDiameter(rect.width, rect.height, origin.x, origin.y)
        );
      };

      measure();

      const observer = new ResizeObserver(measure);
      observer.observe(node);

      const fonts = document.fonts;
      if (fonts?.ready) {
        fonts.ready.then(measure).catch(() => undefined);
      }

      return () => observer.disconnect();
    }, [showFill, origin.x, origin.y]);

    const fillTransition = { duration: FILL_DURATION, ease: FILL_EASE };

    const setMergedRef = React.useCallback(
      (node: HTMLElement | null) => {
        elementRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const commonProps = {
      className: cn(
        componentThemeClassName,
        "relative inline-flex h-11 cursor-pointer touch-manipulation select-none items-center justify-center overflow-hidden rounded-[10px] px-6 font-medium text-sm tracking-[-0.02em]",
        "border border-neutral-300 bg-transparent text-neutral-900",
        "transition-[color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        showFill && (isWhiteFill ? "!text-neutral-950" : "!text-white"),
        className
      ),
      "data-pressed": isPressed ? "true" : "false",
      onBlur: (event: any) => {
        onBlur?.(event);
        setIsPressed(false);
        if (!event.defaultPrevented) {
          setHovered(false);
        }
      },
      onClick,
      onFocus: (event: any) => {
        onFocus?.(event);
        if (isDisabled || event.defaultPrevented) return;
        if (event.currentTarget.matches(":focus-visible")) {
          updateOriginFromCenter();
          setHovered(true);
        }
      },
      onKeyDown: (event: any) => {
        onKeyDown?.(event);

        if (
          event.defaultPrevented ||
          isDisabled ||
          event.repeat ||
          (event.key !== " " && event.key !== "Enter")
        ) {
          return;
        }

        if (event.key === " ") {
          event.preventDefault();
        }

        updateOriginFromCenter();
        setIsPressed(true);
        setHovered(true);
      },
      onKeyUp: (event: any) => {
        onKeyUp?.(event);

        if (event.key === " " || event.key === "Enter") {
          setIsPressed(false);
          if (!event.currentTarget.matches(":focus-visible")) {
            setHovered(false);
          }
        }
      },
      onPointerCancel: (event: any) => {
        onPointerCancel?.(event);
        setIsPressed(false);
      },
      onPointerDown: (event: any) => {
        onPointerDown?.(event);

        if (event.defaultPrevented || isDisabled || event.button !== 0) {
          return;
        }

        updateOriginFromPointer(event);
        setIsPressed(true);
        setHovered(true);
      },
      onPointerEnter: (event: any) => {
        onPointerEnter?.(event);
        if (isDisabled || event.defaultPrevented) return;
        updateOriginFromPointer(event);
        setHovered(true);
      },
      onPointerLeave: (event: any) => {
        onPointerLeave?.(event);
        setHovered(false);
        setIsPressed(false);
      },
      onPointerUp: (event: any) => {
        onPointerUp?.(event);
        setIsPressed(false);
      },
      whileTap: isDisabled ? undefined : { scale: 0.985 },
    };

    const fillCircle = (
      <motion.span
        animate={{ scale: showFill && coverSize > 0 ? 1 : 0 }}
        aria-hidden
        className={cn(
          "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
          isWhiteFill ? "bg-white" : "bg-neutral-900",
          fillClassName
        )}
        initial={false}
        style={{
          height: coverSize,
          left: origin.x,
          top: origin.y,
          width: coverSize,
        }}
        transition={fillTransition}
      />
    );

    const innerContent = (
      <>
        {fillCircle}
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {children}
        </span>
      </>
    );

    if (href) {
      return (
        <motion.a
          {...(commonProps as any)}
          {...(props as any)}
          href={href}
          ref={setMergedRef as any}
        >
          {innerContent}
        </motion.a>
      );
    }

    return (
      <motion.button
        {...(commonProps as any)}
        {...(props as any)}
        aria-busy={loading || undefined}
        disabled={isDisabled}
        ref={setMergedRef as any}
        type={type}
      >
        {innerContent}
      </motion.button>
    );
  }
);

OriginButton.displayName = "OriginButton";

export { OriginButton };
