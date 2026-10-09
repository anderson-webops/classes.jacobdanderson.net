"""Finite placement for equal-sized, center-anchored rectangular tiles."""
import random


def layout_positions(count, width, height, tile_width, tile_height, gap=12, rng=None):
    values = (count, width, height, tile_width, tile_height, gap)
    if any(type(value) is not int for value in values):
        raise ValueError("Layout dimensions and count must be integers")
    if count < 0 or gap < 0 or min(width, height, tile_width, tile_height) <= 0:
        raise ValueError("Invalid layout dimensions or count")
    columns = max(0, (width - gap) // (tile_width + gap))
    rows = max(0, (height - gap) // (tile_height + gap))
    capacity = columns * rows
    if count > capacity:
        raise ValueError("Too many tiles for this canvas and tile size")
    chooser = random if rng is None else rng
    cells = chooser.sample(range(capacity), count)
    return [
        (
            gap + (cell % columns) * (tile_width + gap) + tile_width / 2,
            gap + (cell // columns) * (tile_height + gap) + tile_height / 2,
        )
        for cell in cells
    ]
