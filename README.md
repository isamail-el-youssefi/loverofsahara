# Dropleather Canvas

Build a modern, high-end white-label B2B eCommerce platform landing page for "Dropleather" using React, Vite, Tailwind CSS, Lucide Icons, and Framer Motion.

GLOBAL CONTAINER & LAYOUT ARCHITECTURE

- Container Width: Full viewport width edge-to-edge layout with uniform horizontal inset padding (`px-4 sm:px-6 lg:px-10`). No narrow `max-w-7xl` centered constraints unless specified inside card containers.

- Canvas Background: Off-white/pure white (`#FFFFFF` to `#F9F9F9`).

- Card Border Radius: Consistent large rounded corners (`rounded-[2rem]` to `rounded-[2.5rem]`).

- Visual Padding Style: Floating card effect created by thick, visible white margins around media containers.

- Typography: Tight-tracked, heavy sans-serif headings (Inter or Geist, `tracking-tight font-bold`) combined with gray muted secondary text (`text-neutral-500 font-normal`).

NAVBAR & HERO SECTION

- Outer Wrapper: Full width with subtle white edge margins, embedding a full-bleed hero container with a high-resolution dark artisanal leather crafting video/image background (`rounded-[2.5rem] overflow-hidden relative min-h-[90vh] flex flex-col justify-between p-6 md:p-10`).

- Top Bar Overlay: Transparent background overlaid directly on top of the hero background image/video.

  - Left: Brand logo "Dropleather" in bold white text.

  - Center/Right Links: "How it works", "Pricing", "Help Center", "Affiliate". Text color: white/90.

  - CTA Group: Separator vertical bar `|`, rounded pill button "Login" (outline), and filled pill button "Signup" (`bg-white text-black rounded-full px-5 py-2 text-sm font-medium`).

- Hero Center Content:

  - H1: Centered, giant, high-impact headline in white text: "Dropship custom leather goods under your brand with Dropleather".

  - Subtitle: Centered gray/white paragraph (`max-w-2xl mx-auto text-sm md:text-base text-neutral-200 mt-4`): "Pick from 200+ custom leather goods or bring your own design. Our white-label leather goods are made in our factory and shipped as premium leather goods under your brand. No minimum order."

  - CTA Buttons (Centered Row):

    - Primary CTA: White filled pill button (`bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-neutral-100 transition`). Text: "Start for free".

    - Secondary CTA: Glassmorphism translucent button (`bg-black/30 backdrop-blur-md border border-white/30 text-white font-medium px-6 py-3 rounded-full hover:bg-black/50 transition`). Text: "See how it works".

SECTION 1: ABOUT & VALUE STATS (Two-Column Layout)

- Layout: Full width (`px-4 md:px-10 py-16 flex flex-col gap-10`).

- Top Header: Small red indicator bullet `• About us` followed by a large headline with mixed text opacity:

  - Headline: "Sell premium leather goods under your brand without inventory. Choose ready-to-brand products <span class='text-neutral-400'>with no minimum order or develop your own design from 30 pieces.</span>"

- Lower Grid (Stats Stack + Hero Showcase Image):

  - Left Column (Vertical Stack of 4 Glass Stat Cards + CTA):

    - 4 stacked horizontal cards with light gray/white background (`bg-neutral-50 border border-neutral-100 rounded-2xl p-5 shadow-sm`):

      1. Stat: `2` | Label: "ways to build your leather brand"

      2. Stat: `0` | Label: "minimum order for ready-to-brand products"

      3. Stat: `30` | Label: "pieces to start your custom production"

      4. Stat: `1` | Label: "partner handling production, packing and delivery"

    - Bottom Dark Card CTA: Solid dark charcoal card (`bg-[#121212] text-white rounded-2xl p-5 flex justify-between items-center cursor-pointer hover:bg-black transition`): Text: "More about us", Icon: 45-degree arrow (`ArrowUpRight`).

  - Right Column: Large landscape card with rounded corners (`rounded-[2.5rem] overflow-hidden bg-red-950`), filled with a macro close-up image of red stitched luxury leather.

SECTION 2: PRODUCT CATEGORIES GRID

- Section Header:

  - Left Title: "Leather Goods <span class='text-neutral-400 font-normal'>Categories.</span>" (`text-4xl md:text-5xl font-bold`).

  - Center Paragraph: Small gray text: "We make and ship leather goods under your brand with no stock, storage, or minimum orders."

  - Right Button: Rounded outline pill button with arrow: "See what we make ↗".

- Category Grid (2x2 Asymmetric Media Grid):

  - 4 large rounded image cards (`rounded-[2rem] overflow-hidden relative group min-h-[420px]`):

    1. Card 1: Woman holding dark red leather briefcase ("Women's Custom Leather Bags & Handbags").

    2. Card 2: Macro shot of black leather jacket zipper ("Custom Leather Jackets — Men's & Women's").

    3. Card 3: Man carrying rich brown leather document bag ("Men's Custom Leather Bags & Accessories").

    4. Card 4: Black chunky leather loafers on wooden chair ("Custom Leather Loafers & Footwear").

  - Overlay Details: Subtle bottom dark gradient overlay (`bg-gradient-to-t from-black/80 via-transparent to-transparent`) with bold white category titles anchored to the bottom-left corner (`p-6 text-white text-lg font-semibold`).

SECTION 3: OUR PROCESS (Numbered Cards Flow)

- Layout: 2-column layout (`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-16 px-4 md:px-10`).

- Left Column (`lg:col-span-5`):

  - Tag: "Our process".

  - H2: "Our custom leather goods are <span class='text-neutral-400 font-normal'>handcrafted in our workshops using generations of expertise.</span>"

  - Button: Outline pill button "Let's get started ↗".

- Right Column (`lg:col-span-7` - Stacked Process Step Cards):

  - 3 stacked light grey rounded cards (`bg-neutral-50/80 border border-neutral-200/60 rounded-2xl p-6 hover:shadow-md transition flex flex-col gap-2`):

    - 1.  Brand & design setup: "Choose your brand identity, select colors, and pick from our premium leather products to define your signature style."

    - 2.  Product customisation & sampling: "Add your special touch using our advanced tools to match your vision or create unique products directly through our app."

    - 3.  In-house production & quality control: "We handle production across 50+ expert ateliers, ensuring every piece meets the highest standards of luxury and craftsmanship."

SECTION 4: LATEST ARTICLES (Editorial Blog Section)

- Layout: Full width (`px-4 md:px-10 py-16`).

- Header Bar: "Latest <span class='text-neutral-400 font-normal'>Articles.</span>" with subtext "Stay ahead in the digital world with expert insights on branding, design, and marketing." and right button "View all ↗".

- Article Grid (2 Large Equal Columns):

  - Article Card 1: Large rounded image (`rounded-[2rem] overflow-hidden h-[450px] object-cover`), headline below: "Guide to Start an Online Store Without Inventory (2026)", subtext: "Aug 7, 2025".

  - Article Card 2: Large rounded image of model with leather bag (`rounded-[2rem] overflow-hidden h-[450px] object-cover`), headline below: "How to Make $1,000 Fast in 2026 (Proven & Realistic Methods)", link subtext: "Read article →".

SECTION 5: "LET'S WORK TOGETHER" CTA SECTION

- Container: Bordered inner card with white background (`bg-white border border-neutral-200 rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden mb-8`).

- Massive Background Headline: Giant bold text spanning full width: "Let's Work Together." (`text-6xl md:text-9xl font-black tracking-tighter text-black`).

- Content Grid (2 Columns below headline):

  - Left Column: Subtext "Want to bring your leather brand to life? Get in touch and we'll make it happen.", followed by dark CTA button ("Get in touch ↗"), giant bold email link (`text-2xl md:text-3xl font-semibold border-b border-neutral-200 pb-2 inline-block text-black hover:text-neutral-600`), and social links (Twitter/x, Instagram, Youtube).

  - Right Column: Wide landscape image card (`rounded-2xl overflow-hidden relative h-48 md:h-56`) featuring hands sewing leather at a machine, with subtle overlaid text: "Let's craft something amazing together."

SECTION 6: ULTRA-DARK FOOTER WITH GIANT WATERMARK TEXT

- Wrapper: Deep charcoal background container (`bg-[#121212] text-white rounded-t-[2.5rem] p-8 md:p-12 overflow-hidden flex flex-col justify-between`).

- Top Row: Logo "Dropleather", description "Custom leather goods, made in our factory and shipped under your brand. Zero inventory, no minimums.", and Newsletter Signup form (input box + "Sign up" rounded pill button).

- Navigation Columns Grid (5 Columns):

  - Dropleather: About, Contact us, Talk to Sales, Merchant protection, Careers

  - Solutions: White label Products, Design your own, Shipping & Delivery, Quality, Design Maker

  - Opportunities: Dropleather Academy, Become an investor, Affiliates Program, Blog

  - Integrations: Shopify, Etsy, WooCommerce, TikTok Shop, Amazon, eBay

  - Legal: Terms & Conditions, Privacy Policy, Returns Policy, Cookie Policy

- Low-Opacity Copyright Row: "© 2025-2026 All rights reserved" right-aligned in small text (`text-xs text-neutral-500`).

- Bottom Massive Watermark: Ultra-large text spanning edge-to-edge at the very bottom: "Make it. Brand it." (`text-6xl md:text-[11vw] font-black tracking-tight text-white leading-none pt-10 select-none opacity-95`).

ANIMATIONS & INTERACTION (Framer Motion)

- Entrance Animations: Smooth fade-up (`initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}`) on all process cards, category cards, and article items.

- Hover Effects: Micro scale zoom on image hover (`group-hover:scale-105 transition duration-500 ease-out`).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/58626575-aab8-4bec-8b37-8f33a9a0e299).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
