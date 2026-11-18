import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { cn } from "@/lib/utils";
import { renderPage } from "./pdf";

/** One brochure page drawn from the PDF. Fades in once it is ready; the cover (if given) shows meanwhile. */
export function PdfCanvas({
  doc,
  id,
  page,
  width,
  placeholder,
  className,
}: {
  doc: PDFDocumentProxy | null;
  id: string;
  page: number;
  /** CSS width in pixels. */
  width: number;
  /** Image shown until the page is drawn (the cover, for page 1). */
  placeholder?: string | undefined;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    if (!doc || width < 40) return;
    let live = true;
    renderPage(doc, id, page, width)
      .then((src) => {
        const dst = ref.current;
        if (!live || !dst) return;
        dst.width = src.width;
        dst.height = src.height;
        dst.getContext("2d")?.drawImage(src, 0, 0);
        setReady(true);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [doc, id, page, Math.round(width / 8)]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-[#f4efe6]", className)}>
      {placeholder && !ready && <img src={placeholder} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />}
      <canvas
        ref={ref}
        aria-label={`Page ${page}`}
        role="img"
        className={cn("absolute inset-0 h-full w-full transition-opacity duration-500", ready ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}
