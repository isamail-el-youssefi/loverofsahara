import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import sewingImg from "@/assets/sewing.jpg";
import redStitchImg from "@/assets/red-stitch.jpg";
import article1Img from "@/assets/article-1.jpg";
import article2Img from "@/assets/article-2.jpg";

const tabs = [
  {
    id: 1,
    title: "1. Customise Your Sahara Route & Camp",
    content:
      "Select your departure point from Zagora, Ouarzazate, or Marrakech. Choose between authentic nomadic desert bivouacs or royal luxury glamping tents with private ensuite bathrooms and plush Berber bedding.",
    timeline: "Planning Stage",
    img: article1Img,
  },
  {
    id: 2,
    title: "2. Draa Valley Oasis & Ancient Kasbahs",
    content:
      "Depart Zagora through Morocco's longest palm grove. Explore ancient fortified Ksars, the historic 16th-century Tamgroute Quranic library, green pottery ateliers, and the southern outpost of M'Hamid El Ghizlane.",
    timeline: "Day 1 • Morning",
    img: sewingImg,
  },
  {
    id: 3,
    title: "3. 4x4 Off-Road Crossing into Erg Chegaga",
    content:
      "Leave paved roads behind for 60km of thrilling Sahara desert tracks. Cross the stony Hamada, the Sacred Oasis of Oum Lâaghar, and arrive at the colossal 300-meter golden waves of Erg Chegaga.",
    timeline: "Day 1 • Afternoon",
    img: redStitchImg,
  },
  {
    id: 4,
    title: "4. Sunset Dunes, Nomadic Feast & Stargazing",
    content:
      "Ride camels to the summit of the highest dunes for an unforgettable sunset. Gather around the cedar campfire for live Sahrawi music, slow-simmered tagines, Taguella sand bread, and sleep under a sky of infinite stars.",
    timeline: "Night & Sunrise",
    img: article2Img,
  },
];

export function InventorySection() {
  const [activeTab, setActiveTab] = useState(2);

  const activeTabData = tabs.find((t) => t.id === activeTab) || tabs[1];

  return (
    <div id="itinerary" className="px-4 py-10 md:px-10">
      <section className="bg-[#141414] rounded-[24px] p-6 md:p-12 lg:p-16 text-white flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-24">
        {/* Left side */}
        <div className="w-full lg:w-[45%] flex flex-col justify-between">
          <div>
            <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-medium tracking-tight leading-[1.1] mb-10 text-white">
              Zagora to Erg Chegaga. Pure nomad soul.
            </h2>

            <div className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left px-5 py-4 md:px-6 md:py-5 rounded-[16px] text-[16px] md:text-[18px] font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#1c1c1c] text-white"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4">
            <a
              href="#contact"
              className="inline-flex w-full items-center justify-between rounded-[12px] bg-white px-6 py-4 text-[15px] font-semibold text-black transition hover:bg-neutral-100"
            >
              Plan your custom tour <ArrowUpRight size={20} className="text-black rotate-90" />
            </a>
          </div>
        </div>

        {/* Right side */}
        <div className="w-full lg:w-[55%] min-h-[400px] lg:min-h-[500px]">
          <div className="w-full h-full bg-[#1c1c1c] rounded-[24px] overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-[15px] leading-[1.6] text-neutral-300 pr-4"
                >
                  {activeTabData.content}
                </motion.p>
              </AnimatePresence>

              <div className="flex items-center gap-4 text-[13px] text-neutral-500 mt-12 md:mt-0">
                <span>Timeline</span>
                <div className="flex-1 h-[1px] bg-neutral-800"></div>
                <span className="whitespace-nowrap">{activeTabData.timeline}</span>
              </div>
            </div>

            <div className="w-full md:w-1/2 h-[300px] md:h-full relative overflow-hidden bg-neutral-900">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeTab}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  src={activeTabData.img}
                  alt={activeTabData.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
