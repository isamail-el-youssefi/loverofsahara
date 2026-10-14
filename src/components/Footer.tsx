import { useState } from "react";
import { TextRollHover } from "@/components/ui/text-stagger-hover";

const footerCols = [
  {
    title: "Lover of Sahara",
    links: [
      { name: "About Us", href: "#" },
      { name: "Contact us", href: "#contact" },
      { name: "Our Nomad Guides", href: "#" },
      { name: "Zagora Gateway", href: "#" },
      { name: "Sustainability", href: "#" },
    ],
  },
  {
    title: "Expeditions",
    links: [
      { name: "Erg Chegaga 2D/1N", href: "#expeditions" },
      { name: "Zagora to Foum Zguid 3D", href: "#expeditions" },
      { name: "Marrakech to Chegaga 4D", href: "#expeditions" },
      { name: "Sunset Camel Caravans", href: "#expeditions" },
      { name: "Private 4x4 Dune Tours", href: "#expeditions" },
    ],
  },
  {
    title: "Destinations",
    links: [
      { name: "Zagora & Draa Valley", href: "#destinations" },
      { name: "Erg Chegaga Dunes", href: "#destinations" },
      { name: "M'Hamid El Ghizlane", href: "#destinations" },
      { name: "Lake Iriki (Dry Lake)", href: "#destinations" },
      { name: "Tamgroute Pottery", href: "#destinations" },
    ],
  },
  {
    title: "Experiences",
    links: [
      { name: "Luxury Desert Glamping", href: "#process" },
      { name: "Traditional Nomad Bivouac", href: "#process" },
      { name: "Sahara Stargazing Nights", href: "#process" },
      { name: "Berber Fireside Dining", href: "#process" },
      { name: "Sandboarding & Trekking", href: "#process" },
    ],
  },
  {
    title: "Legal & Info",
    links: [
      { name: "Terms & Conditions", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Desert Packing Guide", href: "#blog" },
      { name: "Weather in Zagora", href: "#" },
      { name: "Booking Policy", href: "#" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="w-full min-h-[85vh] lg:h-[96vh] px-[4px] pb-[4px] pt-0 flex flex-col">
      <footer className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-b-2xl bg-[#0f0f0f] px-6 py-8 md:px-12 md:pt-10 md:pb-4 lg:px-16 lg:pt-12 lg:pb-6 text-white">
        {/* Top & Navigation Container (Grouped together so links stick to border-b) */}
        <div>
          {/* Top Header Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end border-b border-neutral-300/20 pb-8 pt-12">
            {/* Brand Name */}
            <div className="lg:col-span-4">
              <a href="#" className="text-2xl md:text-4xl uppercase font-bold tracking-tight text-white hover:opacity-90 transition">
                Lover of Sahara
              </a>
            </div>

            {/* Tagline / Mission */}
            <div className="lg:col-span-4 lg:px-4">
              <p className="text-xs md:text-base font-medium leading-tight text-neutral-400 max-w-sm">
              </p>
            </div>

            {/* Newsletter Box */}
            <div className="lg:col-span-4 w-full">
              <p className="text-xs md:text-base font-medium text-neutral-300 mb-3.5 w-full">
                Stay connected with Sahara travel insights and exclusive desert stories.
              </p>
              {subscribed ? (
                <div className="w-full rounded-[10px] bg-neutral-900 border border-white/20 px-5 py-2.5 text-xs md:text-lg text-neutral-200">
                  ✨ Thank you for subscribing to Lover of Sahara updates!
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full items-center rounded-[10px] bg-[#f2f2f2] p-1.5 pl-5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-white/40"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    aria-label="Email address"
                    className="w-full bg-transparent text-sm text-black placeholder:text-neutral-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 cursor-pointer rounded-[10px] bg-[#121212] px-10 py-2 text-xs md:text-lg font-semibold text-white transition hover:bg-neutral-800"
                  >
                    Sign up
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* 5-Column Navigation Links */}
          <div className="pt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
            {footerCols.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-normal text-neutral-400">{col.title}</h4>
                <ul className="mt-2.5 space-y-1.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-xs sm:text-lg leading-relaxed font-semibold text-white/70 transition hover:text-neutral-300 inline-block"
                      >
                        <TextRollHover activeClassName="text-white font-medium">
                          {link.name}
                        </TextRollHover>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Copyright & Massive Typography */}
        <div className="flex flex-col justify-end mt-auto pt-6 pb-10">
          <p className="text-right text-xs text-neutral-400 mb-2">
            © 2025–2026 Lover of Sahara. All rights reserved.
          </p>

          <div className="select-none uppercase text-[11.5vw] font-bold leading-[0.88] tracking-[-0.04em] text-neutral-200 whitespace-nowrap overflow-hidden">
            Authentic. Wild.
          </div>
        </div>
      </footer>
    </div>
  );
}
