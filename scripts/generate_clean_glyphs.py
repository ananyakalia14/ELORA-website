import cv2
import numpy as np

img = cv2.imread('public/elora-logo.png', cv2.IMREAD_UNCHANGED)
if img is None:
    raise ValueError("Logo not found")

alpha = img[:, :, 3]
h, w = alpha.shape

up = cv2.resize(alpha, (w * 3, h * 3), interpolation=cv2.INTER_CUBIC)
ret, thresh = cv2.threshold(up, 128, 255, cv2.THRESH_BINARY)
contours, hierarchy = cv2.findContours(thresh, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)

def to_svg_d(cnt):
    approx = cv2.approxPolyDP(cnt, 0.65, True)
    pts = approx.reshape(-1, 2) / 3.0
    return f"M {pts[0][0]:.2f} {pts[0][1]:.2f} " + " ".join([f"L {p[0]:.2f} {p[1]:.2f}" for p in pts[1:]]) + " Z"

# Separate glyphs with their holes
# 1. Leaf: 26
leaf_d = to_svg_d(contours[26])
leaf_len = round(cv2.arcLength(contours[26], True) / 3.0, 1)

# 2. E: 21 (top/serifs), 17 (lower sweep)
e_d = to_svg_d(contours[21]) + " " + to_svg_d(contours[17])
e_len = round((cv2.arcLength(contours[21], True) + cv2.arcLength(contours[17], True)) / 3.0, 1)

# 3. L: 20 (stem), 16 (base serif)
l_d = to_svg_d(contours[20]) + " " + to_svg_d(contours[16])
l_len = round((cv2.arcLength(contours[20], True) + cv2.arcLength(contours[16], True)) / 3.0, 1)

# 4. O: 25 (outer), 18 (inner hole)
o_d = to_svg_d(contours[25]) + " " + to_svg_d(contours[18])
o_len = round((cv2.arcLength(contours[25], True) + cv2.arcLength(contours[18], True)) / 3.0, 1)

# 5. RA: 23 (outer loop, flourish, A leg), 24 (INNER HOLE OF A)
ra_d = to_svg_d(contours[23]) + " " + to_svg_d(contours[24])
ra_len = round((cv2.arcLength(contours[23], True) + cv2.arcLength(contours[24], True)) / 3.0, 1)

# 6. Subtitle "SKIN & BEAUTY"
sub_indices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
sub_d = " ".join([to_svg_d(contours[i]) for i in sub_indices])
sub_len = round(sum([cv2.arcLength(contours[i], True) for i in sub_indices]) / 3.0, 1)

# Combined full wordmark + leaf + subtitle for static rendering
all_wordmark_d = f"{leaf_d} {e_d} {l_d} {o_d} {ra_d} {sub_d}"

with open('src/logoData.js', 'w', encoding='utf-8') as f:
    f.write(f'''// Mathematically grouped glyphs with proper compound paths for holes
export const LOGO_VIEWBOX = "0 0 {w} {h}";
export const LOGO_WIDTH = {w};
export const LOGO_HEIGHT = {h};

export const LOGO_GLYPHS = [
  {{
    id: 'leaf',
    name: 'Leaf Accent',
    d: "{leaf_d}",
    length: {leaf_len},
    delay: 0.15,
    isLeaf: true
  }},
  {{
    id: 'e',
    name: 'É',
    d: "{e_d}",
    length: {e_len},
    delay: 0.05
  }},
  {{
    id: 'l',
    name: 'L',
    d: "{l_d}",
    length: {l_len},
    delay: 0.25
  }},
  {{
    id: 'o',
    name: 'O',
    d: "{o_d}",
    length: {o_len},
    delay: 0.4
  }},
  {{
    id: 'ra',
    name: 'RA',
    d: "{ra_d}",
    length: {ra_len},
    delay: 0.55
  }},
  {{
    id: 'subtitle',
    name: 'SKIN & BEAUTY',
    d: "{sub_d}",
    length: {sub_len},
    delay: 0.95
  }}
];

export const LOGO_COMBINED_PATH = "{all_wordmark_d}";
''')

print("Successfully generated src/logoData.js with proper compound glyph paths!")
