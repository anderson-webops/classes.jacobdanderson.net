# Unity Game Development Practice Pack

Use these supplied cases when a learner needs deterministic data, a no-download alternative, or a shared comparison point. Record the Unity editor and package versions beside any live result. The tables use fictional project names and contain no learner data.

## Setup and Source Hygiene Case

### Baseline record

| Field                      | Supplied value                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| Project                    | Signal Garden                                                                                 |
| Editor                     | Unity 6.3 LTS, exact patch recorded by the learner                                            |
| Render route               | Built-in 2D or 3D template; record the selected route                                         |
| Required folders           | `Assets/Scenes`, `Assets/Scripts`, `Assets/Prefabs`, `Assets/Art`, `Assets/Audio`             |
| Required source files      | `Packages/manifest.json`, `Packages/packages-lock.json`, `ProjectSettings/ProjectVersion.txt` |
| Excluded generated folders | `Library`, `Temp`, `Logs`, `Obj`, local build output                                          |

### Asset review

| Asset                 | Source                | License status       | Repository decision         |
| --------------------- | --------------------- | -------------------- | --------------------------- |
| Player square         | Created in the editor | Self-created         | Track                       |
| Unity sample icon     | Unity sample package  | Verify package terms | Track source note           |
| Commercial soundtrack | Unrecorded            | Unknown              | Do not import               |
| CC0 click sound       | Named public source   | CC0                  | Track with attribution note |

Create a smoke scene with one player, obstacle, camera, and script log. Then diagnose one supplied failure: wrong editor version, missing scene reference, package mismatch, or unlicensed asset.

## Components and Lifecycle Case

Use this component map for a player object.

| Responsibility        | Component or script        | Required evidence            |
| --------------------- | -------------------------- | ---------------------------- |
| Position and rotation | Transform                  | Inspector values             |
| Visible appearance    | Renderer or SpriteRenderer | Player visible in Game view  |
| Physical body         | Rigidbody or Rigidbody2D   | Body type and constraints    |
| Contact boundary      | Collider or Collider2D     | Bounds visible in Scene view |
| Tunable movement      | `PlayerMover`              | Private serialized speed     |
| State trace           | `LifecycleTrace`           | Ordered Console messages     |

Predict the order of `Awake`, `OnEnable`, `Start`, `Update`, and `FixedUpdate`. Classify each task—cache a reference, read frame input, apply physics motion, initialize score, and report collision—by its appropriate lifecycle path. Repair a supplied missing Inspector reference without making the field public only for convenience.

## Input Movement and Camera Case

The supplied action map contains `Move`, `Jump`, and `Pause`. Keyboard bindings are complete; controller bindings are optional.

| Trial | Target frame rate | Speed | Acceleration | Camera damping | Observation |
| ----- | ----------------: | ----: | -----------: | -------------: | ----------- |
| A     |                30 |     5 |           18 |           0.15 | Record      |
| B     |               120 |     5 |           18 |           0.15 | Record      |
| C     |                60 |     7 |           26 |           0.08 | Record      |

Convert the `Move` action into intent before changing Transform or Rigidbody state. Compare trials A and B for frame-rate stability, then compare B and C for feel. Record one control, camera, or tuning revision and the observation that supports it.

## Physics Collision and Collection Case

Complete the interaction matrix before editing callbacks.

| Object A | Object B | Blocks movement? | Reports event? | State change            |
| -------- | -------- | ---------------- | -------------- | ----------------------- |
| Player   | Floor    | Yes              | Optional       | Grounded                |
| Player   | Coin     | No               | Yes            | Score +1; coin disabled |
| Player   | Hazard   | Project decision | Yes            | Lost                    |
| Player   | Finish   | No               | Yes            | Won                     |
| Coin     | Coin     | No               | No             | None                    |

Test these failures: the coin increments twice, a trigger never fires, the player passes through the floor, a 2D callback is used with 3D components, and restart leaves the coin disabled. For each, name the likely component, layer, callback, or reset issue and the smallest confirming check.

## UI State and Restart Case

Use the following state transitions.

| Current state | Event          | Next state | Visible result                     |
| ------------- | -------------- | ---------- | ---------------------------------- |
| Pre-game      | Start          | Playing    | Controls and HUD active            |
| Playing       | Pause          | Paused     | Pause menu and focus visible       |
| Paused        | Resume         | Playing    | Game resumes                       |
| Playing       | Goal reached   | Won        | Win message and restart action     |
| Playing       | Hazard reached | Lost       | Failure message and restart action |
| Won or Lost   | Restart        | Pre-game   | Score, objects, and timer reset    |

Reject impossible transitions such as Paused directly to Won without a game rule. Check every state with keyboard navigation, visible focus, readable text, and a status cue that does not depend on color or sound alone.

## Prefabs Levels and Feedback Case

Create one collectible or hazard prefab with configurable value, speed, or damage. Use this bounded spawn plan.

| Wave | Count | Interval | Allowed region   | Stop rule             |
| ---- | ----: | -------: | ---------------- | --------------------- |
| 1    |     3 |    1.5 s | Marked play area | All collected or 20 s |
| 2    |     5 |    1.2 s | Marked play area | All collected or 25 s |
| 3    |     6 |    1.0 s | Marked play area | Win, loss, or 30 s    |

Map three events to feedback.

| Event   | Visual or motion cue | Audio cue    | Nonaudio equivalent            |
| ------- | -------------------- | ------------ | ------------------------------ |
| Collect | Scale pulse          | Short chime  | Score and icon change          |
| Damage  | Brief flash or shake | Impact sound | Health and text change         |
| Win     | Banner and animation | Win cue      | Win heading and restart button |

Verify prefab overrides, spawn bounds, object cleanup, animation transitions, and one local build launch.

## Capstone Playtest and Revision Case

Choose one bounded vertical slice:

1. **Relic Runner:** movement, one collectible, one hazard, one finish, and restart.
2. **Robot Repair:** movement, one interaction, one blocked path, completion, and restart.
3. **Arena Alchemist:** movement, one hazard pattern, one power-up, timer or score, and restart.

Required one-page brief: audience, goal, controls, core loop, required mechanics, scenes, stand-in assets, accessibility route, risks, non-goals, and done criteria.

Use fictional playtest labels.

| Case | Starting state | Task              | Observed result | Type                                | Severity | Decision    | Retest |
| ---- | -------------- | ----------------- | --------------- | ----------------------------------- | -------- | ----------- | ------ |
| P1   | Fresh launch   | Reach the goal    | Record          | Bug / usability / balance / request | 1–3      | Fix / defer | Record |
| P2   | After loss     | Restart           | Record          | Bug / usability / balance / request | 1–3      | Fix / defer | Record |
| P3   | Paused         | Resume and finish | Record          | Bug / usability / balance / request | 1–3      | Fix / defer | Record |

Revise the two highest-impact findings, produce a local build, and list known limits.

## Testing Profiling and Builds Case

Use one deterministic rule for an Edit Mode test and one scene route for a Play Mode smoke check.

| Check                   | Supplied target                                           |
| ----------------------- | --------------------------------------------------------- |
| Edit Mode standard case | Score changes from 2 to 3 after one collectible           |
| Edit Mode boundary case | A disabled collectible cannot score twice                 |
| Play Mode smoke         | Scene loads, player appears, and Pre-game reaches Playing |
| Build Profile           | Desktop target, named scene list, explicit output folder  |
| Profile symptom         | 200 objects allocated every frame during a spawn loop     |

Classify failures as logic, serialized scene wiring, package or test assembly setup, build configuration, or performance. Record measured evidence before and after changing the spawn loop. Keep any CI route bounded to tests, source validation, and build configuration checks.

## Full Project Repository Workflow Case

Audit the supplied starter and solution using this inventory.

| Path or artifact              | Starter                         | Review state             | Repository rule |
| ----------------------------- | ------------------------------- | ------------------------ | --------------- |
| `Assets/Scenes`               | Playable baseline               | Completed vertical slice | Track           |
| `Assets/Scripts`              | Intentional incomplete behavior | Reviewed behavior        | Track           |
| `Packages/manifest.json`      | Present                         | Present                  | Track           |
| `Packages/packages-lock.json` | Present                         | Present                  | Track           |
| `ProjectSettings`             | Present                         | Present                  | Track           |
| `Assets/Tests`                | Smoke or placeholder boundary   | Passing selected tests   | Track           |
| `THIRD_PARTY_ASSETS.md`       | Template                        | Complete                 | Track           |
| `.gitattributes`              | LFS rules                       | Verified LFS rules       | Track           |
| `Library` and `Temp`          | Absent                          | Absent                   | Ignore          |

Write a checkpoint containing scene or system, scripts changed, play or test result, one decision, one unresolved risk, and next action. Then describe how a clean machine can clone, open, play, test, and build the project.
