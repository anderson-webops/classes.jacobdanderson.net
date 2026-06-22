import type { RawCourse } from "./types";

function repo(folder: string) {
	return `https://github.com/instruction-material/Unity-Game-Development/tree/main/${folder}`;
}

export const unityGameDevelopmentCourse: RawCourse = {
	name: "Unity Game Development",
	modules: [
		{
			kind: "appendix",
			title: "Legacy Snapshot Archive: GD6 Collision, Collection, and Platformer Mechanics",
			curriculum: [
				{
					title: "GD6.1 Collision Commotion",
					content:
						"Use this legacy C# script snapshot as a focused collision-reading exercise. Identify which object moves, which object detects contact, whether the contact blocks movement or only triggers an event, and what evidence in the script proves that behavior. Treat the snapshot as reference practice before applying the same idea inside the full Unity project sequence.",
					projectLink: repo("UGD-06-01-collision-commotion")
				},
				{
					title: "GD6.2 Collecting Coins",
					content:
						"Track collectible state from collision event to score update. A complete review names the pickup object, the player or detector object, the script that stores score, and the moment when the coin is removed or disabled. Include one edge case, such as collecting the same coin twice or touching a non-collectible collider.",
					projectLink: repo("UGD-06-02-collecting-coins")
				},
				{
					title: "GD6.3 Collecting Colliding Chaos",
					content:
						"Combine movement, collisions, and collectible logic in one constrained practice project. Test at least two collision cases, record the expected state change for each case, and explain which script owns movement, score, cleanup, and feedback. The purpose is ownership clarity, not adding more mechanics.",
					projectLink: repo("UGD-06-03-collecting-colliding-chaos")
				}
			],
			supplementalProjects: [
				{
					title: "Collision State Review",
					content:
						"Use the paired starter and review snapshots as extra collision and object-state practice. Compare the initial and completed versions by naming the minimum script changes, the expected player-visible behavior, and one bug that would appear if a collider, tag, or serialized reference were missing.",
					projectLink: repo("UGD-03-supplemental-1-starter"),
					solutionLink: repo("UGD-03-supplemental-1-solution")
				},
				{
					title: "Module 3 Transfer Practice",
					content:
						"Extend the module mechanics with one additional game-rule constraint, such as a pickup limit, hazard exception, cooldown, or scoring condition. Compare against the solution snapshot by explaining which state variable or event callback changed and how the changed rule is tested.",
					projectLink: repo("UGD-03-supplemental-2-starter"),
					solutionLink: repo("UGD-03-supplemental-2-solution")
				}
			]
		},
		{
			kind: "appendix",
			title: "Legacy Snapshot Archive: GD7 UI Text and Start Flow",
			curriculum: [
				{
					title: "GD7.1 Displaying Text",
					content:
						"Read the snapshot as a small model of UI responsibility. The game manager owns broad game state, the player script owns player behavior, and the text component displays the current state without becoming the place where core rules are hidden.",
					projectLink: repo("UGD-07-01-displaying-text")
				},
				{
					title: "GD7.2 Changing Text",
					content:
						"Update text in response to gameplay events and describe the full path from event to stored value to visible text. Include one normal path and one changed-state path, such as score increasing, a win message appearing, or an instruction changing after the game starts.",
					projectLink: repo("UGD-07-02-changing-text")
				},
				{
					title: "GD7.3 Start Button",
					content:
						"Add a start-button flow that separates pre-game state from active gameplay. The review target is a clear transition: before the button is clicked, controls and game rules are limited; after the click, gameplay begins and UI text reflects the new state.",
					projectLink: repo("UGD-07-03-start-button")
				},
				{
					title: "GD7.4 User-Friendly Platformer",
					content:
						"Combine UI feedback and player control into a more polished platformer snapshot. Explain what the player knows at every moment: the goal, current state, score or progress, failure condition, and available next action.",
					projectLink: repo("UGD-07-04-user-friendly-platformer")
				}
			],
			supplementalProjects: [
				{
					title: "Module 3 Transfer Practice Alternate",
					content:
						"Use the alternate supplemental snapshot for additional UI and event-flow practice. Compare it to the main version by identifying the same state transition in a different scene or script arrangement, then note which organization is easier to debug.",
					projectLink: repo(
						"UGD-03-supplemental-2-alternate-starter"
					),
					solutionLink: repo(
						"UGD-03-supplemental-2-alternate-solution"
					)
				}
			]
		},
		{
			kind: "appendix",
			title: "Legacy Snapshot Archive: GD8 Boundaries, Win States, and Hazards",
			curriculum: [
				{
					title: "GD8.1 Out of Bounds",
					content:
						"Detect when a player leaves the playable space and decide how the game responds: reset position, lose health, restart the level, or show a failure state. A complete review names the boundary condition and the state change that follows.",
					projectLink: repo("UGD-08-01-out-of-bounds")
				},
				{
					title: "GD8.2 Winning and Restarting",
					content:
						"Connect a win condition to a restart flow so level state and reset behavior are explicit. Explain what counts as winning, which objects or variables must reset, and how to prove a fresh run starts from the same initial state.",
					projectLink: repo("UGD-08-02-winning-and-restarting")
				},
				{
					title: "GD8.3 Killer Objects",
					content:
						"Hazard objects create failure states without turning the player script into a catch-all manager. Identify whether the hazard, player, or game manager owns detection, damage or failure, UI feedback, and restart behavior.",
					projectLink: repo("UGD-08-03-killer-objects")
				}
			],
			supplementalProjects: []
		},
		{
			kind: "appendix",
			title: "Legacy Snapshot Archive: Module 4 Mechanics Projects",
			curriculum: [
				{
					title: "Legacy Module 4 Project 1: Combined Mechanics Snapshot",
					content:
						"Build or inspect a small mechanics snapshot that combines movement, state updates, and player feedback. The expected explanation names the core loop, the state variables that change during play, and the feedback that tells the player whether the action succeeded.",
					projectLink: repo("UGD-04-project-1")
				},
				{
					title: "Legacy Module 4 Project 2: Rule Extension Snapshot",
					content:
						"Extend the module project with a second mechanic or rule and document the behavior change. Keep the extension narrow enough to test: one new rule, one expected player-visible result, one edge case, and one note about which script changed.",
					projectLink: repo("UGD-04-project-2")
				}
			],
			supplementalProjects: []
		},
		{
			kind: "appendix",
			title: "Legacy Snapshot Archive: Module 5 Capstone Snapshots",
			curriculum: [
				{
					title: "Legacy Module 5 Project 1: Capstone Loop Snapshot",
					content:
						"Use the first capstone snapshot to organize a more complete game loop and test the major state transitions. The review identifies the start condition, active-play loop, success or failure condition, restart path, and one dependency that must be present for the project to open cleanly.",
					projectLink: repo("UGD-05-project-1")
				},
				{
					title: "Legacy Module 5 Project 2: Final Polish Snapshot",
					content:
						"Use the final project snapshot to refine gameplay behavior, UI feedback, and restart or completion flow. Separate required behavior from polish: a working loop, clear feedback, and reproducible reset come before optional art, animation, or extra levels.",
					projectLink: repo("UGD-05-project-2")
				}
			],
			supplementalProjects: []
		}
	]
};
