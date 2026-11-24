/** Blog articles (content only, no React), shared by the article page and the build-time prerender. */
import { ARTICLE_IMAGES as IMG } from "@/data/siteImages";

export interface ArticleData {
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

export const blogArticles: ArticleData[] = [
  {
    id: 1,
    img: IMG.chegagaDunes,
    category: "Desert Expeditions",
    title: "Erg Chegaga vs Erg Chebbi:\nWhy Morocco's Wildest Dunes Win",
    author: "Salah Mouna",
    authorRole: "Owner & desert guide",
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
          src: IMG.duneCrests,
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
        quoteAuthor: "Salah Mouna, Native Zagora Nomad Guide"
      },
      {
        heading: "03 / Reaching the Dunes via 4x4 Overland",
        paragraphs: [
          "The expedition departs from Zagora, traveling south past the final oasis settlement of M'Hamid El Ghizlane. From here, our Land Cruisers lower tire pressure to glide over sand trails, navigation points, and rocky plateaus where ancient marine fossils rest in the open sun.",
          "Along the way, travelers pause at the Sacred Oasis of Oum Lâaghar, where underground springs feed wild palm clusters that have sustained nomadic caravans for centuries."
        ],
        images: {
          src: IMG.bivouac,
          caption: "FIG 02. Private nomad bivouac set beneath the golden peaks of Chegaga.",
          aspect: "duo",
          secondarySrc: IMG.bivouacWide,
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
    img: IMG.desertCamp,
    category: "Travel & Packing",
    title: "What to Pack for a Night in the Zagora Sahara:\nThe Complete Checklist",
    author: "Salah Mouna",
    authorRole: "Owner & desert guide",
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
          src: IMG.desertGarments,
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
        quoteAuthor: "Salah Mouna, Lover of Sahara Team"
      }
    ]
  },
  {
    id: 3,
    img: IMG.irikiCrossing,
    category: "4x4 Expeditions",
    title: "The Legendary Crossing of Lake Iriki\n& the Paris-Dakar Route",
    author: "Salah Mouna",
    authorRole: "Owner & desert guide",
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
          src: IMG.expeditionVehicle,
          caption: "Expedition vehicles traversing the ancient clay plains of Lake Iriki.",
          aspect: "duo",
          secondarySrc: IMG.irikiPlain,
          secondaryCaption: "Surreal horizon where desert flats meet the Anti-Atlas foothills."
        }
      }
    ]
  },
  {
    id: 4,
    img: IMG.teaCeremony,
    category: "Culture & Nomadic Heritage",
    title: "Nomadic Traditions of the Draa Valley:\nTea, Music & Taguella Bread",
    author: "Salah Mouna",
    authorRole: "Owner & desert guide",
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
          src: IMG.mintTea,
          caption: "The ceremonial preparation of Moroccan mint tea inside the nomadic tent.",
          aspect: "single"
        }
      }
    ]
  }
];
