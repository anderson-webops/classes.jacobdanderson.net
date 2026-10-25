# Drawing Shapes

Append a green rectangle, a blue circle and a red ellipse to an SVG. Set rectangles with x/y/width/height, circles with cx/cy/r, and ellipses with cx/cy/rx/ry. Change one coordinate or size at a time and predict the result.

The starter preserves the original unfinished exercise.

## Canvas

SVG positions use the original drawing coordinates. A viewBox defines that coordinate area; CSS scales the SVG to the available width without changing the shape positions. For this project, use `.attr("viewBox", "0 0 400 200")` after setting the SVG width and height.

## Run

Open index.html in a browser. D3 and its license are included locally, so the export runs offline.

## Source

Adapted from [Juni Learning’s original starter project](https://codepen.io/junilearning/pen/zYrPBYM). The original exercise and geometry are retained. 
