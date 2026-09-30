import cv2
import numpy as np
import os

img = cv2.imread('public/elora-logo.png', cv2.IMREAD_UNCHANGED)
if img is None:
    raise ValueError("Logo not found")

alpha = img[:, :, 3]
h, w = alpha.shape

# Upscale 3x for super smooth bezier/polygon curves
up = cv2.resize(alpha, (w * 3, h * 3), interpolation=cv2.INTER_CUBIC)
ret, thresh = cv2.threshold(up, 128, 255, cv2.THRESH_BINARY)

contours, hierarchy = cv2.findContours(thresh, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
print('Found contours:', len(contours))

# We can separate paths for each contour so we can animate stroke paths individually!
paths_list = []
for i, cnt in enumerate(contours):
    epsilon = 0.7
    approx = cv2.approxPolyDP(cnt, epsilon, True)
    if len(approx) < 3:
        continue
    pts = approx.reshape(-1, 2) / 3.0
    d = f"M {pts[0][0]:.2f} {pts[0][1]:.2f} " + " ".join([f"L {p[0]:.2f} {p[1]:.2f}" for p in pts[1:]]) + " Z"
    # calculate perimeter for stroke dasharray
    length = cv2.arcLength(cnt, True) / 3.0
    paths_list.append((d, length))

print(f"Kept {len(paths_list)} paths")

combined_d = " ".join([p[0] for p in paths_list])

svg_animated = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="100%" height="100%" class="elora-svg-logo">
  <defs>
    <filter id="subtle-glow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#3A2E2B" flood-opacity="0.12" />
    </filter>
  </defs>
  <g class="elora-logo-group">
    <path
      class="elora-logo-path"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="{combined_d}"
      fill="#3A2E2B"
    />
  </g>
</svg>'''

os.makedirs('public', exist_ok=True)
with open('public/elora-logo.svg', 'w', encoding='utf-8') as f:
    f.write(svg_animated)

# Also generate a js module with the path data and contours so React can manipulate them smoothly
with open('src/logoData.js', 'w', encoding='utf-8') as f:
    f.write(f'''// Automatically generated from Élora brand asset
export const LOGO_VIEWBOX = "0 0 {w} {h}";
export const LOGO_WIDTH = {w};
export const LOGO_HEIGHT = {h};
export const LOGO_COMBINED_PATH = "{combined_d}";
export const LOGO_CONTOURS = {repr([{"d": p[0], "length": round(p[1], 1)} for p in paths_list])};
''')

print("Created public/elora-logo.svg and src/logoData.js successfully!")
