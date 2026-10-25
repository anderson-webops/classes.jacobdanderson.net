# Smiley Face

Draw two green rectangular eyes and an arc mouth. The reference uses eyes at (200,25) and (290,25), each 10 by 100, and a mouth translated to (250,200). Convert 90 and 270 degrees to radians and use inner/outer radii 90/100. Compare the result after changing one angle or radius.

The reference shows one complete drawing.

## Canvas

SVG positions use the original drawing coordinates. A viewBox defines that coordinate area; CSS scales the SVG to the available width without changing the shape positions. For this project, use `.attr("viewBox", "0 0 500 500")` after setting the SVG width and height.

## Run

Open index.html in a browser. D3 and its license are included locally, so the export runs offline.

## Source

Adapted from [Juni Learning’s original reference project](https://codepen.io/junilearning/pen/593993382174caa7d510ddbd5b0009d8). The original exercise and geometry are retained. Add explicit viewBox scaling and accessible drawing name; keep original coordinates and width/height variables.
