import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

/** Newsletter sign-up shared by every footer design. `tone` is the colour of the surface it sits on. */
export function NewsletterForm({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const { site } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  if (subscribed) {
    return (
      <div
        className={cn(
          "w-full rounded-[10px] border px-5 py-2.5 text-sm md:text-base",
          tone === "dark" ? "border-white/20 bg-neutral-900 text-neutral-200" : "border-ink/15 bg-ink/[0.04] text-ink",
          className,
        )}
      >
        {site.footer.thanks}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full items-center rounded-[10px] p-1.5 pl-5 transition-all focus-within:ring-2",
        tone === "dark"
          ? "bg-neutral-100 shadow-sm focus-within:ring-white/40"
          : "border border-ink/20 bg-paper focus-within:ring-ink/30",
        className,
      )}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={site.footer.emailPlaceholder}
        aria-label={site.footer.emailLabel}
        className="w-full bg-transparent text-sm text-ink placeholder:text-neutral-500 focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 cursor-pointer rounded-[10px] bg-ink px-6 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 md:px-10 md:text-base"
      >
        {site.footer.signUp}
      </button>
    </form>
  );
}
