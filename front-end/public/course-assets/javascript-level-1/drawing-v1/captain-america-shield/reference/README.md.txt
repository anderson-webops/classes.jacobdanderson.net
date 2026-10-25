# Captain America's Shield

Draw four concentric circles centered at (200,200): radii 110, 90, 70 and 50, colored red, white, red and blue. Create a D3 star with d3.symbol().type(d3.symbolStar).size(2000), attach it to a path with the d attribute, fill it white and translate it to the same center. Append the outer circle first and the star last.

The reference shows one complete drawing.

## Canvas

SVG positions use the original drawing coordinates. A viewBox defines that coordinate area; CSS scales the SVG to the available width without changing the shape positions. For this project, use `.attr("viewBox", "0 0 750 750")` after setting the SVG width and height.

## Run

Open index.html in a browser. D3 and its license are included locally, so the export runs offline.

## Source

Adapted from [Juni Learning’s original reference project](https://codepen.io/junilearning/pen/0736d5c2045c3ecd6969c5284b93b067). The original exercise and geometry are retained. Distinguish concentric layers in copied comments Add explicit viewBox scaling and accessible drawing name; keep original coordinates and width/height variables.
