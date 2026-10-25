# Snowman

Draw a snowman with three white body circles on a black background. Add eyes, a nose, an arc mouth and two brown line arms. Use the same x center for the body circles; SVG y coordinates increase downward. A line needs x1/y1/x2/y2 and a visible stroke color. Keep each body, face and arm section separate.

The starter preserves the original unfinished exercise.

## Canvas

SVG positions use the original drawing coordinates. A viewBox defines that coordinate area; CSS scales the SVG to the available width without changing the shape positions. For this project, use `.attr("viewBox", "0 0 750 750")` after setting the SVG width and height.

## Run

Open index.html in a browser. D3 and its license are included locally, so the export runs offline.

## Source

Adapted from [Juni Learning’s original starter project](https://codepen.io/junilearning/pen/GRoOjjx). The original exercise and geometry are retained. Use visible example line color on the original black background.
