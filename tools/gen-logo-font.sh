#!/bin/bash
#
# Subset the 華康隸書 wordmark font down to only the glyphs actually rendered,
# and output a tiny woff2. The full .TTC is ~8.8 MB (whole CJK font); the site
# only renders 7 characters in it, so the subset is a few KB.
#
# Run this whenever the ZH wordmark TEXT changes (the characters rendered in
# .navbar__wordmark-title / .footer__wordmark-zh, currently 蒙特梭利幼兒園).
# Adding a character to the wordmark without re-running means the new glyph
# falls back to Noto Serif TC (明體) instead of 隸書.
#
# Usage:  ./tools/gen-logo-font.sh
# Requires: python3 with fonttools + brotli  (pip3 install --user fonttools brotli)
#
set -euo pipefail
cd "$(dirname "$0")/.."   # repo root

SRC='assets/fonts/華康隸書體W5&W5(P).TTC'
OUT='assets/fonts/dfp-lishu-subset.woff2'

# The exact characters rendered in the 隸書 wordmark font (--font-logo on ZH).
# The brand "咪咪 & 家田" is an SVG (wordmark.svg), not this font, so it is not
# included. Keep this in sync with .navbar__wordmark-title / .footer__wordmark-zh.
TEXT='蒙特梭利幼兒園'

python3 -m fontTools.subset "$SRC" \
  --font-number=0 \
  --text="$TEXT" \
  --flavor=woff2 \
  --layout-features='' \
  --no-hinting \
  --desubroutinize \
  --output-file="$OUT"

echo "✓ Wrote $OUT ($(du -h "$OUT" | cut -f1)) — glyphs: $TEXT"
echo "  If the wordmark text changed, also bump style.css?v= on the pages."
