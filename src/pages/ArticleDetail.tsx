import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Share2, Bookmark } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { OriginButton } from "@/components/ui/origin-button";
import article1 from "@/assets/article-1.jpg";
import article2 from "@/assets/article-2.jpg";
import redStitch from "@/assets/red-stitch.jpg";
import sewing from "@/assets/sewing.jpg";
import catJacket from "@/assets/cat-jacket.jpg";
import catShoes from "@/assets/cat-shoes.jpg";
import catMen from "@/assets/cat-men.jpg";
import catWomen from "@/assets/cat-women.jpg";

interface ArticleData {
  id: number;
  img: string;
  category: string;
  title: string;
  author: string;
  authorRole: string;
  published: string;
  updated: string;
  readTime: string;
  lead: string;
  sections: {
    heading?: string;
    paragraphs: string[];
    quote?: string;
    quoteAuthor?: string;
    images?: {
      src: string;
      caption?: string;
      aspect?: "single" | "duo";
      secondarySrc?: string;
      secondaryCaption?: string;
    };
    highlights?: { title: string; desc: string }[];
  }[];
}

const blogArticles: ArticleData[] = [
  {
    id: 1,
    img: article1,
    category: "DESERT EXPEDITIONS",
    title: "Erg Chegaga vs Erg Chebbi:\nWhy Morocco's Wildest Dunes Win",
    author: "Brahim Ait Mansour",
    authorRole: "Lead Desert Guide, Zagora",
    published: "October 14, 2025, 08:30am GMT+1",
    updated: "January 10, 2026, 05:15pm GMT+1",
    readTime: "6 min read",
    lead: "Morocco possesses two primary Saharan dune systems: Erg Chebbi in Merzouga and Erg Chegaga south of Zagora. For travelers yearning for untamed wilderness, absolute silence, and authentic nomadic heritage, Erg Chegaga remains in a league of its own.",
    sections: [
      {
        heading: "01 / The Scale & Raw Wilderness of Chegaga",
        paragraphs: [
          "Erg Chegaga is Morocco's largest and most expansive dune field, stretching across roughly 40 kilometers with towering crests reaching up to 300 meters in height. Unlike Erg Chebbi, which sits directly adjacent to paved tarmac and hotels, Erg Chegaga is located deep in the desert interior.",
          "Reaching Chegaga requires a 60-kilometer off-road 4x4 expedition through stony hamada, acacia trees, and the dried expanse of Lake Iriki. This natural barrier preserves its isolation, providing an untouched desert wilderness where the only sounds are the whistling wind and shifting sands."
        ],
        images: {
          src: redStitch,
          caption: "FIG 01. Golden hour illumination over the high crests of Erg Chegaga.",
          aspect: "single"
        }
      },
      {
        heading: "02 / Key Differences at a Glance",
        paragraphs: [
          "Understanding the logistical and atmospheric differences between Morocco's two dune destinations helps you choose the authentic journey you desire."
        ],
        highlights: [
          {
            title: "Erg Chegaga (Zagora)",
            desc: "40km wild expanse, 300m dune height, accessed exclusively via off-road 4x4, untouched nomadic atmosphere, virtually zero light pollution."
          },
          {
            title: "Erg Chebbi (Merzouga)",
            desc: "Paved road directly to the dune base, high density of hotels and quad bike rentals, highly accessible but significantly more commercialized."
          },
          {
            title: "The Route from Zagora",
            desc: "Travels through the lush palm groves of the Drâa Valley, historic earthen Ksars, Tamgroute pottery ateliers, and the Sacred Oasis."
          },
          {
            title: "Stargazing Quality",
            desc: "Ranked among the darkest night skies in North Africa, offering pristine Milky Way viewing and uninterrupted astrophotography."
          }
        ],
        quote: "In Chegaga, you do not simply see the Sahara — you feel its ancient, uninterrupted heartbeat.",
        quoteAuthor: "Brahim, Native Zagora Nomad Guide"
      },
      {
        heading: "03 / Reaching the Dunes via 4x4 Overland",
        paragraphs: [
          "The expedition departs from Zagora, traveling south past the final oasis settlement of M'Hamid El Ghizlane. From here, our Land Cruisers lower tire pressure to glide over sand trails, navigation points, and rocky plateaus where ancient marine fossils rest in the open sun.",
          "Along the way, travelers pause at the Sacred Oasis of Oum Lâaghar, where underground springs feed wild palm clusters that have sustained nomadic caravans for centuries."
        ],
        images: {
          src: sewing,
          caption: "FIG 02. Private nomad bivouac set beneath the golden peaks of Chegaga.",
          aspect: "duo",
          secondarySrc: catJacket,
          secondaryCaption: "FIG 03. 4x4 crossing the vast terrain of the Drâa desert plateau."
        }
      },
      {
        heading: "04 / Sunset Camel Trekking & Campfire Evenings",
        paragraphs: [
          "As the harsh desert sun softens into honey-gold and amber hues, a quiet camel trek brings you to the summit of the tallest dunes. From the ridge, the golden sea appears boundless, rolling towards the Algerian border.",
          "Evenings at our nomad camp feature traditional earthen tagines, freshly baked sand bread (Taguella), and the hypnotic rhythms of Sahrawi desert drums around a crackling cedar fire."
        ]
      }
    ]
  },
  {
    id: 2,
    img: article2,
    category: "TRAVEL & PACKING",
    title: "What to Pack for a Night in the Zagora Sahara:\nThe Complete Checklist",
    author: "Youssef El Sahraoui",
    authorRole: "Expedition Coordinator, Zagora",
    published: "November 02, 2025, 11:15am GMT+1",
    updated: "January 14, 2026, 03:40pm GMT+1",
    readTime: "5 min read",
    lead: "The Sahara Desert is a realm of dramatic contrasts — radiant sunshine by day and crisp, star-filled cool breezes by night. Here is our essential packing guide developed over two decades of desert exploration from Zagora.",
    sections: [
      {
        heading: "01 / Day-to-Night Layering Strategy",
        paragraphs: [
          "Desert temperatures can fluctuate significantly between midday and midnight. Breathable, loose-fitting linen or cotton long-sleeve shirts protect you from intense UV rays during daytime exploration while keeping you comfortably ventilated.",
          "For evening camp gatherings and early morning sunrise hikes on the dunes, pack a warm fleece jacket, windbreaker, or woolen pullover, as the desert cooling effect sets in rapidly after sunset."
        ],
        images: {
          src: catShoes,
          caption: "Traditional Moroccan desert garments provide natural thermal regulation and sun protection.",
          aspect: "single"
        }
      },
      {
        heading: "02 / Essential Gear & Sand Protection",
        paragraphs: [
          "Fine Saharan sand has a way of finding its way into unsealed bags and sensitive electronics. Simple preparations make all the difference:"
        ],
        highlights: [
          {
            title: "Traditional Cheche (Tagelmust)",
            desc: "A 4- to 6-meter indigo or cotton desert turban wrapped by your guide. It protects eyes, mouth, and neck from sun and desert breezes."
          },
          {
            title: "UV Sunglasses & High-SPF Sunscreen",
            desc: "Polarized lenses reduce glare reflecting off golden sand dunes. Mineral sunscreen and lip balm prevent dehydration."
          },
          {
            title: "Sturdy Footwear & Camp Slippers",
            desc: "Closed-toe hiking shoes for stony Hamada trails, plus slip-on sandals for relaxing inside your desert tent and climbing soft dunes barefoot."
          },
          {
            title: "Portable Power Bank",
            desc: "While luxury camps offer solar electricity, having a 10,000+ mAh power bank ensures your camera and phone never run out of battery during dune sunsets."
          }
        ],
        quote: "Dress for the sun, prepare for the stars, and let the desert strip away all unnecessary noise.",
        quoteAuthor: "Youssef, Lover of Sahara Team"
      }
    ]
  },
  {
    id: 3,
    img: article1,
    category: "4X4 EXPEDITIONS",
    title: "The Legendary Crossing of Lake Iriki\n& the Paris-Dakar Route",
    author: "Omar Ben Ali",
    authorRole: "Master 4x4 Navigator",
    published: "November 20, 2025, 09:00am GMT+1",
    updated: "December 18, 2025, 01:20pm GMT+1",
    readTime: "5 min read",
    lead: "Once a vibrant freshwater lake populated by gazelles and flamingos, Lake Iriki is now a surreal, shimmering dry salt flat that formed one of the most celebrated legs of the historic Paris-Dakar Rally.",
    sections: [
      {
        heading: "01 / Mirage on the Horizon",
        paragraphs: [
          "Crossing the vast dried bed of Lake Iriki between Erg Chegaga and Foum Zguid is an otherworldly sensory experience. The flat clay cracked surface extends to the horizon, creating shimmering heat mirages that resemble vast bodies of water beneath distant mountain ridges.",
          "Our experienced 4x4 drivers navigate this legendary terrain with ease, allowing you to experience the exhilarating speed and infinite horizons that fascinated rally legends."
        ],
        images: {
          src: catMen,
          caption: "Expedition vehicles traversing the ancient clay plains of Lake Iriki.",
          aspect: "duo",
          secondarySrc: catWomen,
          secondaryCaption: "Surreal horizon where desert flats meet the Anti-Atlas foothills."
        }
      }
    ]
  },
  {
    id: 4,
    img: article2,
    category: "CULTURE & NOMADIC HERITAGE",
    title: "Nomadic Traditions of the Draa Valley:\nTea, Music & Taguella Bread",
    author: "Fatima Zahra Draoui",
    authorRole: "Cultural Heritage Coordinator",
    published: "December 05, 2025, 02:30pm GMT+1",
    updated: "January 08, 2026, 04:00pm GMT+1",
    readTime: "7 min read",
    lead: "Beyond the breathtaking dunes, the true soul of the Sahara lies in the warm hospitality of its people. From the three-glass tea ceremony to the ancient art of sand-baked bread, discover the living heritage of Zagora.",
    sections: [
      {
        heading: "01 / The Three Glasses of Desert Tea",
        paragraphs: [
          "In Saharan nomad culture, offering tea is a sacred covenant of welcome. As the famous desert proverb teaches: 'The first glass is as bitter as life, the second is as sweet as love, and the third is as gentle as death.'",
          "Prepared over burning embers with fresh mint, wild sage, and gunpowder green tea, the pot is poured from great heights to generate a crowned foam (regga) that captures the aromas."
        ],
        images: {
          src: redStitch,
          caption: "The ceremonial preparation of Moroccan mint tea inside the nomadic tent.",
          aspect: "single"
        }
      }
    ]
  }
];

export function ArticleDetail({ id }: { id: number | null }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const currentIndex = blogArticles.findIndex((a) => a.id === id);
  const article = currentIndex !== -1 ? blogArticles[currentIndex] : blogArticles[0];

  const nextArticle =
    blogArticles[(currentIndex + 1) % blogArticles.length] || blogArticles[0];

  return (
    <div className="min-h-screen bg-white selection:bg-neutral-900 selection:text-white">
      {/* Hero Section - 90vh (Preserving user modifications) */}
      <div className="h-[90vh] p-[4px]">
        <section className="relative flex h-full flex-col justify-end overflow-hidden rounded-2xl p-6 md:p-10">
          <img
            src={article.img}
            alt={article.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Same Navbar as HeroSection */}
          <Navbar className="top-[-15px] left-[-5px]" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-[900px] w-full"
          >
            {/* Breadcrumbs */}
            <div className="mb-6 flex items-center gap-2 text-xs font-light text-white/70">
              <a href="#" className="hover:text-white transition">Home</a>
              <span>/</span>
              <a href="#blog" className="hover:text-white transition">Blog</a>
              <span>/</span>
              <span className="text-white/90">{article.category}</span>
            </div>

            {/* Category Subheading */}
            <p className="mb-4 text-sm font-light text-white/80 uppercase">
              {article.category}
            </p>

            {/* Title */}
            <h1 className="mb-8 text-[2.75rem] font-medium leading-[1] tracking-tighter text-white sm:text-[3.5rem] lg:text-[68px] whitespace-pre-line">
              {article.title}
            </h1>

            {/* Author Info */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-white/80">
              <span>
                By{" "}
                <a
                  href="#"
                  className="text-white underline decoration-white/40 underline-offset-4 transition hover:decoration-white"
                >
                  {article.author}
                </a>
                , {article.authorRole}
              </span>
              <span className="hidden sm:inline text-white/40">|</span>
              <span>Published {article.published}</span>
              <span className="hidden sm:inline text-white/40">|</span>
              <span>Updated {article.updated}</span>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Article Content Layout - Minimalist Editorial */}
      <main className="mx-auto max-w-[760px] px-6 py-16 md:px-8 md:py-20">
        {/* Meta Bar: Read time & Sharing */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-6 text-xs text-neutral-400 font-medium tracking-wide uppercase">
          <div className="flex items-center gap-2 text-neutral-500">
            <Clock size={14} className="text-neutral-400" />
            <span>{article.readTime}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="flex items-center gap-1.5 hover:text-neutral-900 transition cursor-pointer"
              title="Copy link"
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>
            <button
              className="flex items-center gap-1.5 hover:text-neutral-900 transition cursor-pointer"
              title="Bookmark article"
            >
              <Bookmark size={14} />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Lead Paragraph */}
        <p className="mt-10 text-[20px] md:text-[23px] font-normal leading-[1.6] text-neutral-900 tracking-[-0.015em]">
          {article.lead}
        </p>

        {/* Editorial Sections */}
        <div className="mt-14 space-y-16">
          {article.sections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-6">
              {section.heading && (
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-neutral-950 pt-4">
                  {section.heading}
                </h2>
              )}

              {section.paragraphs.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-[17px] leading-[1.8] text-neutral-600 font-normal tracking-[-0.01em]"
                >
                  {p}
                </p>
              ))}

              {/* Minimal Highlight Specs Grid */}
              {section.highlights && (
                <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {section.highlights.map((item, hIdx) => (
                    <div
                      key={hIdx}
                      className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-5 transition hover:border-neutral-200"
                    >
                      <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-neutral-500 font-normal">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Minimalist Quote */}
              {section.quote && (
                <div className="my-10 border-l-2 border-neutral-900 pl-6 py-1">
                  <blockquote className="text-xl md:text-[22px] font-normal italic leading-snug text-neutral-900 tracking-tight">
                    "{section.quote}"
                  </blockquote>
                  {section.quoteAuthor && (
                    <p className="mt-3 text-xs tracking-wider uppercase text-neutral-400 font-medium">
                      — {section.quoteAuthor}
                    </p>
                  )}
                </div>
              )}

              {/* Image Blocks */}
              {section.images && (
                <figure className="my-10 space-y-3">
                  {section.images.aspect === "duo" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="overflow-hidden rounded-xl bg-neutral-100">
                        <img
                          src={section.images.src}
                          alt="Editorial visual 1"
                          className="h-[380px] w-full object-cover transition duration-500 hover:scale-105"
                        />
                        {section.images.caption && (
                          <p className="p-3 text-[11px] leading-tight text-neutral-400 font-mono">
                            {section.images.caption}
                          </p>
                        )}
                      </div>
                      {section.images.secondarySrc && (
                        <div className="overflow-hidden rounded-xl bg-neutral-100">
                          <img
                            src={section.images.secondarySrc}
                            alt="Editorial visual 2"
                            className="h-[380px] w-full object-cover transition duration-500 hover:scale-105"
                          />
                          {section.images.secondaryCaption && (
                            <p className="p-3 text-[11px] leading-tight text-neutral-400 font-mono">
                              {section.images.secondaryCaption}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl bg-neutral-100">
                      <img
                        src={section.images.src}
                        alt="Editorial photography"
                        className="h-[420px] md:h-[500px] w-full object-cover transition duration-500 hover:scale-105"
                      />
                      {section.images.caption && (
                        <figcaption className="mt-3 text-[11px] leading-relaxed text-neutral-400 font-mono">
                          {section.images.caption}
                        </figcaption>
                      )}
                    </div>
                  )}
                </figure>
              )}
            </section>
          ))}
        </div>

        {/* Minimal Author Card */}
        <div className="mt-20 border-t border-neutral-100 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-6 md:p-8">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Written by
              </span>
              <h3 className="text-lg font-semibold text-neutral-900 tracking-tight">
                {article.author}
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm">
                {article.authorRole} sharing authentic insights, navigation routes, and cultural traditions from the Moroccan Sahara.
              </p>
            </div>
            <OriginButton
              href="#blog"
              className="h-9 rounded-xl border border-neutral-300 px-5 text-xs font-medium text-neutral-900"
            >
              All Stories
            </OriginButton>
          </div>
        </div>

        {/* Next Article Navigator */}
        {nextArticle && (
          <div className="mt-14 border-t border-neutral-100 pt-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Next in Blog
            </span>
            <a
              href={`#article/${nextArticle.id}`}
              className="group mt-4 flex items-center justify-between gap-4 rounded-2xl border border-neutral-100 p-6 transition hover:border-neutral-300 hover:bg-neutral-50/40"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-400">
                  {nextArticle.category}
                </span>
                <h4 className="text-base md:text-lg font-semibold tracking-tight text-neutral-900 group-hover:text-black transition">
                  {nextArticle.title.replace("\n", " ")}
                </h4>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white">
                <ArrowRight size={16} />
              </div>
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
