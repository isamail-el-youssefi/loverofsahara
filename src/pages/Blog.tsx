import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import article1 from "@/assets/article-1.jpg";
import article2 from "@/assets/article-2.jpg";
import { Navbar } from "@/components/Navbar";

const blogArticles = [
  {
    id: 1,
    img: article1,
    alt: "Vast golden sand dunes of Erg Chegaga under open sky",
    title: "Erg Chegaga vs Erg Chebbi: Why Morocco's Wildest Dunes Win (2026)",
    date: "Desert Guide • Oct 14, 2025",
  },
  {
    id: 2,
    img: article2,
    alt: "Traditional nomadic camp under the Milky Way stars in the Sahara",
    title: "What to Pack for a Night in the Zagora Sahara Desert: The Complete Checklist",
    date: "Packing Guide • Nov 02, 2025",
  },
  {
    id: 3,
    img: article1,
    alt: "4x4 convoy crossing the dried Lake Iriki near Erg Chegaga",
    title: "The Legendary Crossing of Lake Iriki & the Paris-Dakar Route",
    date: "Adventure • Nov 20, 2025",
  },
  {
    id: 4,
    img: article2,
    alt: "Berber tea ceremony and campfire hospitality in the Sahara desert",
    title: "Nomadic Traditions of the Draa Valley: Tea, Music & Taguella Bread",
    date: "Culture • Dec 05, 2025",
  },
];

export function Blog() {
  return (
    <div className="relative py-44 ">
      <Navbar theme="light" />
      <section className="px-4 md:px-10">
        <div className="flex flex-col lg:flex-row items-end gap-6 w-full pb-14">
          <h2 className="w-full lg:w-1/2 text-[32px] md:text-[55px] font-semibold tracking-[-0.05em] leading-[1.1] text-[#141414]">
            Sahara Stories.
          </h2>

          <div className="w-full lg:w-1/2 flex justify-between lg:items-end gap-4 lg:text-right">
            <p className="text-[16px] font-medium tracking-[-0.03em] text-neutral-500 max-w-sm text-left">
              Expert guides, expedition itineraries, and cultural insights from our native desert agency in Zagora, Morocco.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-[6px] gap-y-[12px] md:grid-cols-2">
          {blogArticles.map((article, index) => (
            <motion.div
              key={article.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: index * 0.08 }}
            >
              <a
                href={`#article/${article.id}`}
                className="group block cursor-pointer"
              >
                <div className="h-[570px] overflow-hidden rounded-lg">
                  <img
                    src={article.img}
                    alt={article.alt}
                    width={1280}
                    height={960}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight transition group-hover:text-neutral-700">
                  {article.title}
                </h3>
                {article.date ? (
                  <p className="mt-1 text-sm text-neutral-500">{article.date}</p>
                ) : null}
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
