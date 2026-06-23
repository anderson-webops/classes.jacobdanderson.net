# Python Turtle Project Reference

This reference collects the Turtle patterns used in a small game-style project:
basic movement, clean code organization, score display, boundary checks, and
moving triangle enemies. It is meant to be read while building, debugging, or
reviewing a Turtle project.

## Turtle Command Reference

Turtle commands become much easier to remember when the argument units are
clear. Movement distances are measured in screen pixels, turns are measured in
degrees, and coordinates are measured from the center of the canvas.

| Command | Argument or unit | What it does |
| --- | --- | --- |
| `forward(distance)` | pixels | Moves the turtle forward in the direction it is facing. |
| `backward(distance)` | pixels | Moves the turtle backward without changing its heading. |
| `left(degrees)` | degrees | Turns the turtle counterclockwise. |
| `right(degrees)` | degrees | Turns the turtle clockwise. |
| `goto(x, y)` | coordinate pair | Moves the turtle to a specific position. The center is approximately `(0, 0)`. |
| `penup()` | no argument | Moves without drawing a line. |
| `pendown()` | no argument | Starts drawing again after the pen has been lifted. |
| `shape("triangle")` | shape name | Changes the visible turtle shape. Common shapes include `turtle`, `arrow`, `circle`, `square`, and `triangle`. |
| `stamp()` | no argument | Leaves a copy of the turtle's current shape on the canvas. |
| `write(text)` | string or value | Writes text at the turtle's current location. |
| `clear()` | no argument | Clears drawings or text made by that specific turtle. |
| `xcor()` and `ycor()` | no argument | Return the turtle's current x-coordinate and y-coordinate. |
| `hideturtle()` | no argument | Hides the turtle cursor while still allowing it to draw or write. |
| `speed(0)` | speed setting | Draws as quickly as possible. |

Useful movement examples:

```python
player.forward(50)      # Move 50 pixels forward.
player.left(90)         # Turn 90 degrees counterclockwise.
player.right(45)        # Turn 45 degrees clockwise.
player.penup()
player.goto(-120, 80)   # Move to x = -120, y = 80 without drawing.
player.pendown()
```

## Project Organization

Readable Turtle programs usually follow the same broad structure. The exact
details can change, but keeping these sections separate makes the project easier
to extend.

1. Imports

   Put library imports at the top. For a Turtle game, this often includes
   `turtle`, `random`, and sometimes `time`.

2. Function definitions

   Define reusable actions before the main project logic. Examples include
   drawing the border, updating the score, checking bounds, and checking
   collisions. Functions should do one clear job when possible.

3. Variables and object attributes

   Create turtles, constants, score variables, speed values, colors, lists of
   enemies, and starting positions in one area. This makes the game state easy
   to find.

4. One-time setup logic

   Draw the border, place the player, display the starting score, and connect
   keyboard controls. These actions happen once when the program starts.

5. Continuous logic

   Put repeated behavior in the animation loop: move enemies, check collisions,
   update score text, bounce from walls, and refresh the screen.

Comments should explain sections and non-obvious decisions. They do not need to
repeat every command. Group related commands together, especially the common
movement pattern `penup()`, `goto(x, y)`, and `pendown()`.

## Score Turtle Pattern

Use a separate turtle for score text so the player turtle can keep moving
without rewriting the score from the wrong location. The score turtle should
hide itself, lift its pen, move to a corner, clear old text, and write the new
score.

```python
score = 0

score_turtle = turtle.Turtle()
score_turtle.hideturtle()
score_turtle.penup()
score_turtle.goto(-180, 175)

def update_score():
    score_turtle.clear()
    score_turtle.write("Score: " + str(score), font=("Arial", 16, "normal"))

def check_collision(player, target):
    global score

    close_x = abs(player.xcor() - target.xcor()) < 20
    close_y = abs(player.ycor() - target.ycor()) < 20

    if close_x and close_y:
        score += 1
        update_score()
        return True

    return False
```

The `global score` line is needed because the function changes the value of the
score variable that was created outside the function. Without `global score`,
Python treats `score` as a new local variable inside the function.

Calling `clear()` before `write()` prevents the score from being drawn over
itself repeatedly. Without `clear()`, score text can become thick, bold-looking,
or hard to read because several copies overlap.

## Boundaries and In-Bounds Checks

The visible border and the movement rule are two different pieces of logic. The
border turtle draws the box. The bounds check decides whether a movement or
stamp should be allowed.

```python
BOUNDARY = 160

border_turtle = turtle.Turtle()
border_turtle.hideturtle()
border_turtle.speed(0)

def draw_border():
    border_turtle.penup()
    border_turtle.goto(-BOUNDARY, -BOUNDARY)
    border_turtle.pendown()

    for side in range(4):
        border_turtle.forward(BOUNDARY * 2)
        border_turtle.left(90)

def is_inside_bounds(x, y):
    inside_x = -BOUNDARY <= x <= BOUNDARY
    inside_y = -BOUNDARY <= y <= BOUNDARY
    return inside_x and inside_y
```

When checking movement, calculate the target position first. Checking the
turtle's current location is not enough because the current location may still
be legal while the next move would leave the boundary.

```python
def move_player(dx, dy):
    next_x = player.xcor() + dx
    next_y = player.ycor() + dy

    if is_inside_bounds(next_x, next_y):
        player.goto(next_x, next_y)
```

The same idea works before stamping: decide whether the stamp position is legal
before calling `stamp()`.

## Game Template with Score, Boundaries, and Moving Triangles

This template combines the project pieces into one organized program. It uses
visual feedback only. Sound is intentionally left out because Python Turtle
environments do not always support the same sound playback tools.

```python
import random
import time
import turtle


# ------------------------------------------------------------
# Function definitions
# ------------------------------------------------------------

def is_inside_bounds(x, y):
    inside_x = -BOUNDARY <= x <= BOUNDARY
    inside_y = -BOUNDARY <= y <= BOUNDARY
    return inside_x and inside_y


def update_score():
    score_turtle.clear()
    score_turtle.write("Score: " + str(score), font=("Arial", 16, "normal"))


def draw_border():
    border_turtle.penup()
    border_turtle.goto(-BOUNDARY, -BOUNDARY)
    border_turtle.pendown()

    for side in range(4):
        border_turtle.forward(BOUNDARY * 2)
        border_turtle.left(90)


def move_player(dx, dy):
    next_x = player.xcor() + dx
    next_y = player.ycor() + dy

    if is_inside_bounds(next_x, next_y):
        player.goto(next_x, next_y)


def move_up():
    move_player(0, PLAYER_STEP)


def move_down():
    move_player(0, -PLAYER_STEP)


def move_left():
    move_player(-PLAYER_STEP, 0)


def move_right():
    move_player(PLAYER_STEP, 0)


def make_enemy(x, y, dx, dy, color):
    enemy = turtle.Turtle()
    enemy.shape("triangle")
    enemy.color(color)
    enemy.penup()
    enemy.goto(x, y)
    enemy.dx = dx
    enemy.dy = dy
    enemies.append(enemy)


def move_enemies():
    for enemy in enemies:
        next_x = enemy.xcor() + enemy.dx
        next_y = enemy.ycor() + enemy.dy

        if not is_inside_bounds(next_x, enemy.ycor()):
            enemy.dx *= -1
            next_x = enemy.xcor() + enemy.dx

        if not is_inside_bounds(enemy.xcor(), next_y):
            enemy.dy *= -1
            next_y = enemy.ycor() + enemy.dy

        enemy.goto(next_x, next_y)


def check_enemy_collisions():
    global score

    for enemy in enemies:
        close_x = abs(player.xcor() - enemy.xcor()) < HIT_DISTANCE
        close_y = abs(player.ycor() - enemy.ycor()) < HIT_DISTANCE

        if close_x and close_y:
            score += 1
            update_score()
            enemy.goto(random.randint(-120, 120), random.randint(-120, 120))


# ------------------------------------------------------------
# Variables and turtle attributes
# ------------------------------------------------------------

BOUNDARY = 160
PLAYER_STEP = 15
HIT_DISTANCE = 20
score = 0
enemies = []

screen = turtle.Screen()
screen.setup(420, 420)
screen.tracer(0)

player = turtle.Turtle()
player.shape("turtle")
player.color("blue")
player.penup()

score_turtle = turtle.Turtle()
score_turtle.hideturtle()
score_turtle.penup()
score_turtle.goto(-180, 175)

border_turtle = turtle.Turtle()
border_turtle.hideturtle()
border_turtle.speed(0)


# ------------------------------------------------------------
# One-time setup logic
# ------------------------------------------------------------

draw_border()
update_score()

make_enemy(-100, -70, 2, 3, "red")
make_enemy(80, 40, -3, 2, "purple")
make_enemy(20, 120, 2, -2, "orange")

screen.listen()
screen.onkey(move_up, "Up")
screen.onkey(move_down, "Down")
screen.onkey(move_left, "Left")
screen.onkey(move_right, "Right")


# ------------------------------------------------------------
# Continuous game logic
# ------------------------------------------------------------

while True:
    move_enemies()
    check_enemy_collisions()
    screen.update()
    time.sleep(0.03)
```

## Moving Triangles Homework Extension

The moving-triangle extension can be built in small steps:

1. Create more than one triangle turtle.
2. Store all triangle turtles in a list.
3. Give each triangle two movement values, such as `dx` for horizontal speed and
   `dy` for vertical speed.
4. In a loop, add `dx` and `dy` to each triangle's current position.
5. If the next x-position would leave the boundary, multiply `dx` by `-1`.
6. If the next y-position would leave the boundary, multiply `dy` by `-1`.
7. Move the triangle to the corrected next position.

This pattern makes the triangles appear to bounce. The important idea is that
direction is stored as data, not hardcoded as one permanent movement command.

## Sound in CodeHS Turtle

CodeHS supports uploaded files in programs. The Python Turtle command reference
does not show a built-in Turtle sound command, so this reference does not
include sound in the Turtle template.

For a Turtle project, use visual feedback first: score changes, color changes,
stamps, messages, or movement changes. If sound becomes a requirement, test a
small CodeHS program in the exact environment first. If reliable sound playback
is needed for a larger game, Pygame is usually the better next tool because it is
designed for game loops, input, graphics, and sound.
