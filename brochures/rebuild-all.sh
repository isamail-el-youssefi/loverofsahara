#!/bin/sh
# rebuild every translated brochure (fr es de it zh); LITE assets for the long guides
cd "$(dirname "$0")/.."
for l in fr es de it zh; do
  for s in zagora tinghir errachidia ouarzazate midelt; do node brochures/build.mjs $s $l 2>/dev/null | tail -1; done
  for s in general-guide local-gastronomy natural-guide; do LITE=1 node brochures/build.mjs $s $l 2>/dev/null | tail -1; done
done
