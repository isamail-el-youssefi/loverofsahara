import { ParallaxComponent } from "@/components/ui/parallax-scrolling";

export function ParallaxStorySection() {
  return (
    <section className="relative w-full bg-neutral-950">
      <ParallaxComponent
        badge="Wild Sahara • 3D Depth"
        title="BEYOND HORIZONS"
        subtitle="Where the silence of the dunes speaks to the soul"
        tagline="Zagora • Erg Chegaga • Lake Iriki"
      />
    </section>
  );
}

export default ParallaxStorySection;
