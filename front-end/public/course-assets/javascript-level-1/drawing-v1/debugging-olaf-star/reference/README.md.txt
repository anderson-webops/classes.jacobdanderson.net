# Debugging Olaf's Star

Repair the starter so a visible star appears on Olaf’s middle snowball while the rest of the drawing remains intact. Trace the star path, its position variables and its fill. Check the console and fix one fault at a time. The reference centers a yellow star at (150,210).

The reference shows one complete drawing.

## Canvas

SVG positions use the original drawing coordinates. A viewBox defines that coordinate area; CSS scales the SVG to the available width without changing the shape positions. For this project, use `.attr("viewBox", "0 0 750 750")` after setting the SVG width and height.

## Run

Open index.html in a browser. D3 and its license are included locally, so the export runs offline.

## Source

Adapted from [Juni Learning’s original reference project](https://codepen.io/junilearning/pen/20aeca54176134a3397922a9e98f3564). The original exercise and geometry are retained. Correct mouth translation comment Correct bottom body circle comment Add explicit viewBox scaling and accessible drawing name; keep original coordinates and width/height variables.
