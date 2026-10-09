"""A small event reference, independent of every course project solution."""
import pgzrun
from pygame import Rect

WIDTH = 600
HEIGHT = 400
target = Rect(260, 170, 80, 60)
hits = 0
game_state = "ready"
feedback = ""


def clear_feedback():
    global feedback
    feedback = ""


def reset_game():
    global hits, game_state, feedback
    clock.unschedule(clear_feedback)
    hits = 0
    feedback = ""
    game_state = "ready"


def draw():
    screen.fill((25, 35, 55))
    screen.draw.filled_rect(target, (80, 190, 140))
    screen.draw.text("Enter: start | R: reset", (20, 20), fontsize=24)
    screen.draw.text("Left-click the green rectangle", (20, 55), fontsize=24)
    screen.draw.text("Hits: " + str(hits), (20, 95), fontsize=24)
    screen.draw.text(game_state + " " + feedback, (20, 330), fontsize=24)


def update():
    # Frame updates must not reset the score or count another click.
    pass


def on_mouse_down(pos, button):
    global hits, feedback
    if game_state != "playing" or button != mouse.LEFT:
        return
    if target.collidepoint(pos):
        hits += 1
        feedback = "Hit!"
    else:
        feedback = "Miss"
    clock.schedule_unique(clear_feedback, 1.0)


def on_key_down(key):
    global game_state
    if key == keys.R:
        reset_game()
    elif key == keys.RETURN and game_state == "ready":
        game_state = "playing"


pgzrun.go()
