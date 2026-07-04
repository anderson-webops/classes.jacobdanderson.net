import { api } from "@/api";
import {
	listPreviewFiles,
	loadPreviewFile,
	parseGitHubResource
} from "@/modules/codePreview";

const WHITESPACE_RE = /\s+/g;
const FILE_EXTENSION_RE = /\.[\dA-Z]+$/i;
const JAVA_EXTENSION_RE = /\.java$/i;
const PYTHON_EXTENSION_RE = /\.py$/i;
const CODE_EXTENSION_RE = /\.(?:java|py)$/i;
const SAFE_FILE_SEGMENT_RE = /^\w[\w.-]*$/;
const ROOT_TEXT_FILE_RE = /^\w[\w.-]*\.(?:csv|java|json|md|py|txt)$/i;
const IMAGE_FILE_RE = /^images\/\w[\w.-]*\.(?:gif|jpe?g|png|svg|webp)$/i;
const AUDIO_FILE_RE = /^(?:music|sounds)\/\w[\w.-]*\.(?:mp3|ogg|wav)$/i;
const ASSET_DIRECTORY_NAMES = new Set(["images", "music", "sounds"]);
const PYTHON_IDE_RUNTIME_RESERVED_FILE_NAMES = new Set([
	"_classes_artifacts.py",
	"_classes_keras.py",
	"_classes_pgzero.py",
	"keras.py",
	"pgzero.py",
	"pgzrun.py",
	"pygame.py",
	"pysynth.py",
	"streamlit.py",
	"tensorflow.py",
	"turtle.py",
	"zrect.py"
]);
const PYTHON_IDE_RUNTIME_RESERVED_ROOTS = new Set([
	"keras",
	"pgzero",
	"tensorflow"
]);
const TEXT_FILE_RE = /\.(?:csv|java|json|md|py|txt|svg)$/i;
const IMAGE_EXTENSION_RE = /\.(?:gif|jpe?g|png|svg|webp)$/i;
const SOUND_EXTENSION_RE = /\.wav$/i;
const MUSIC_EXTENSION_RE = /\.(?:mp3|ogg)$/i;
const STARTER_RELATIVE_PREFIX_RE = /^(?:starter|src)\//i;
const PYTHON_IDE_INDEXED_DB_NAME = "classes-python-ide";
const PYTHON_IDE_INDEXED_DB_VERSION = 1;
const PYTHON_IDE_PROJECT_STORE = "projectStores";
const JAVA_ENTRY_POINT_IGNORED_TEXT_RE =
	/"""[\s\S]*?"""|\/\*[\s\S]*?\*\/|\/\/[^\n\r]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;
const JAVA_MAIN_METHOD_RE =
	/\bmain\s*\(\s*(?:\w+\s*\[\s*\]\s+\w+|\w+\s+\w+\s*\[\s*\]|\w+\s*\.\.\.\s+\w+)\s*\)/;
const KAREL_RUN_METHOD_RE = /\brun\s*\(\s*\)/;
const PYTHON_IDE_SHARE_ID_RE = /^[\w-]{20,80}$/;

export type PythonIdeFileEncoding = "text" | "base64";

export type PythonIdeMode =
	| "data"
	| "java"
	| "karel"
	| "pgzero"
	| "python"
	| "turtle";
export type PythonIdeProjectTemplate =
	| "blank"
	| "bluej"
	| "course"
	| "demo"
	| "outline";

export interface PythonIdeFile {
	name: string;
	content: string;
	encoding?: PythonIdeFileEncoding;
}

export interface PythonIdeProject {
	_id: string;
	title: string;
	mode: PythonIdeMode;
	files: PythonIdeFile[];
	activeFileName: string;
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	starterLabel?: string;
	starterUrl?: string;
	shared?: boolean;
	shareID?: string;
	shareCreatedAt?: string;
	sharedSourceID?: string;
	createdAt?: string;
	updatedAt?: string;
}

export type SharedPythonIdeProject = Pick<
	PythonIdeProject,
	| "activeFileName"
	| "courseID"
	| "courseProjectKey"
	| "courseProjectTitle"
	| "files"
	| "mode"
	| "starterLabel"
	| "starterUrl"
	| "title"
>;

export type PythonIdeProjectReviewRole = "admin" | "tutor";

export interface PythonIdeProjectReview {
	_id: string;
	sourceProject: string;
	title: string;
	mode: PythonIdeMode;
	files: PythonIdeFile[];
	activeFileName: string;
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	reviewerRole: PythonIdeProjectReviewRole;
	reviewerName?: string;
	lastEditedByRole?: PythonIdeProjectReviewRole;
	lastEditedByName?: string;
	visibleToStudent: boolean;
	note?: string;
	sourceUpdatedAt?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface ManagedPythonIdeProject {
	project: PythonIdeProject;
	review: PythonIdeProjectReview | null;
}

export interface PythonIdeProjectPayload {
	title?: string;
	mode?: PythonIdeMode;
	files?: PythonIdeFile[];
	activeFileName?: string;
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	starterLabel?: string;
	starterUrl?: string;
	sharedSourceID?: string;
}

export interface CreatePythonIdeProjectOptions {
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	files?: PythonIdeFile[];
	sharedSourceID?: string;
	starterLabel?: string;
	starterUrl?: string;
	template?: PythonIdeProjectTemplate;
	title?: string;
}

interface PythonIdeProjectStorageRecord {
	key: string;
	projects: PythonIdeProject[];
	updatedAt: string;
}

export const pythonIdeStorageNamespace = "classes-python-ide-projects";
export const pythonIdeAllowedFileExtensions = [
	".py",
	".java",
	".csv",
	".json",
	".txt",
	".md",
	".png",
	".jpg",
	".jpeg",
	".gif",
	".svg",
	".webp",
	".wav",
	".mp3",
	".ogg"
] as const;
export const pythonIdeFileUploadAccept =
	pythonIdeAllowedFileExtensions.join(",");

let pythonIdeStorageDbPromise: Promise<IDBDatabase> | null = null;

const pythonIdeCourseModes: Record<string, PythonIdeMode> = {
	"ai-level-1": "data",
	"ap-computer-science-a": "java",
	"data-science-in-python": "data",
	"design-patterns-in-java": "java",
	"design-patterns-in-java-part-2": "java",
	"java-level-1": "karel",
	"java-level-2": "java",
	"java-level-3": "java",
	"machine-learning": "data",
	pygames: "pgzero",
	"python-level-1": "turtle",
	"python-level-2": "python",
	"python-level-3": "python",
	"python-to-java-and-cpp-bridge": "python",
	"pythonic-design-patterns": "python"
};

export function normalizePythonIdeMode(
	value: string | null | undefined,
	fallback: PythonIdeMode = "python"
): PythonIdeMode {
	if (value === "bluej") return "java";
	if (
		value === "data" ||
		value === "java" ||
		value === "karel" ||
		value === "pgzero" ||
		value === "turtle"
	) {
		return value;
	}
	if (value === "python") return "python";
	return fallback;
}

export function pythonIdeModeForCourseId(courseId: string | null | undefined) {
	return courseId ? (pythonIdeCourseModes[courseId] ?? null) : null;
}

export function isValidPythonIdeShareID(value: string | null | undefined) {
	return typeof value === "string" && PYTHON_IDE_SHARE_ID_RE.test(value);
}

export const pythonStarterCode = `# Store reusable text in named variables before printing
greeting_message = "Hello, Python!"
print(greeting_message)

# Collect one user value and use its name clearly
student_name = input("What is your name? ")
print(f"Nice to meet you, {student_name}.")
`;

export const turtleStarterCode = `import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "white"
PEN_COLOR = "teal"
PEN_SIZE = 3
FORWARD_STEP = 30
TURN_ANGLE = 20
ANIMATION_STEP = 2
ANIMATION_DELAY_MS = 16
DOT_SIZE = 18
DOT_COLOR = "coral"


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)

pen = turtle.Turtle()
pen.color(PEN_COLOR)
pen.pensize(PEN_SIZE)
is_moving = True


#####################
###   FUNCTIONS   ###
#####################
# Move the turtle by one visible step
def move_forward():
    pen.forward(FORWARD_STEP)

# Rotate the turtle by one visible turn
def turn_left():
    pen.left(TURN_ANGLE)

# Switch the animation loop between moving and paused
def toggle_motion():
    global is_moving
    is_moving = not is_moving

# Advance the animation frame when motion is enabled
def animate():
    # Move only while the project is in its active motion state
    if is_moving:
        pen.forward(ANIMATION_STEP)
    screen.ontimer(animate, ANIMATION_DELAY_MS)

# Draw a dot where the user clicks
def draw_dot(x, y):
    pen.penup()
    pen.goto(x, y)
    pen.pendown()
    pen.dot(DOT_SIZE, DOT_COLOR)

# Move the pen while the turtle is dragged
def drag_pen(x, y):
    pen.goto(x, y)


###########################
###   EVENT LISTENERS   ###
###########################
screen.onkey(move_forward, "Up")
screen.onkey(turn_left, "Left")
screen.onkey(toggle_motion, "space")
screen.onclick(draw_dot)
pen.ondrag(drag_pen)
screen.ontimer(animate, ANIMATION_DELAY_MS)
screen.listen()
`;

export const pythonLevel1OutlineStarterCode = `import turtle
import random

#####################
###   FUNCTIONS   ###
#####################
# Configure one turtle before the main program starts
def setup_turtle(current_turtle, color_name):
    pass

# Run the first keyboard or mouse action
def action_one():
    pass

# Run the second keyboard or mouse action
def action_two():
    pass


#####################
###   VARIABLES   ###
#####################
# Constants
NUM_TURTLES = 0
MOVE_DISTANCE = 1

# Global Variables
main_turtle = turtle.Turtle()
# Turtle attributes here

# Create Screen
screen = turtle.Screen()

###   MORE VARIABLES HERE AS NEEDED   ###

# List of Turtles
turtle_list = []
# Build each extra turtle before the animation loop starts
for turtle_index in range(NUM_TURTLES):
    new_turtle = turtle.Turtle()
    # Turtle attributes here
    turtle_list.append(new_turtle)


###########################
###   EVENT LISTENERS   ###
###########################
screen.onkey(action_one, "KEY_HERE")
screen.onkey(action_two, "KEY_HERE")
# Add any other event listeners here

screen.listen()


#####################
###   MAIN CODE   ###
#####################
condition = True

# Keep the main animation running while the condition is true
while condition:
    main_turtle.forward(MOVE_DISTANCE)

    # Conditions and additional actions here
    # Example if main_turtle.ycor() < -200

    # Update each extra turtle in the list
    for current_turtle in turtle_list:
        current_turtle.forward(MOVE_DISTANCE)

        # Conditions and additional actions here
        # Example if current_turtle.xcor() > 3
`;

export const pgzeroStarterCode = `import pgzrun

WIDTH = 640
HEIGHT = 400
PLAYER_SIZE = 72
PLAYER_SPEED = 4
INSTRUCTION_POSITION = (24, 24)
INSTRUCTION_SIZE = 28
INSTRUCTION_COLOR = "white"

player = Actor("student", (WIDTH / 2, HEIGHT / 2))
player.width = PLAYER_SIZE
player.height = PLAYER_SIZE

# Draw the current frame
def draw():
    screen.clear()
    screen.draw.text(
        "Use the arrow keys to move",
        INSTRUCTION_POSITION,
        color=INSTRUCTION_COLOR,
        fontsize=INSTRUCTION_SIZE
    )
    player.draw()

# Update player movement from held keys
def update():
    # Move left while the left arrow key is held
    if keyboard.left:
        player.x -= PLAYER_SPEED

    # Move right while the right arrow key is held
    if keyboard.right:
        player.x += PLAYER_SPEED

    # Move up while the up arrow key is held
    if keyboard.up:
        player.y -= PLAYER_SPEED

    # Move down while the down arrow key is held
    if keyboard.down:
        player.y += PLAYER_SPEED

pgzrun.go()
`;

export const javaStarterCode = `/**
 * @brief Demonstrate the minimal Java console project shape
 */
public class Main {
    /**
     * @brief Run the starter console program
     *
     * @param args Command-line arguments
     */
    public static void main(String[] args) {
        String greetingMessage = "Hello, Java!";
        System.out.println(greetingMessage);
    }
}
`;

export const javaOutlineStarterCode = `import java.util.ArrayList;
import java.util.Scanner;

/**
 * @brief Organize a beginner Java console project with helpers and lists
 */
public class Main {
    /**
     * @brief Run the starter console program
     *
     * @param args Command-line arguments
     */
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        int score = 0;
        String studentName = "Student";
        ArrayList<String> notes = new ArrayList<>();

        // Prompt, update variables, and call helper methods here
        // String answer = input.nextLine();
        notes.add(makeNote(studentName, score));

        // Print each saved note on its own line
        for (String note : notes) {
            System.out.println(note);
        }
    }

    /**
     * @brief Build a readable note from a student name and score
     *
     * @param studentName Name to show in the note
     *
     * @param score Current score value
     *
     * @return Formatted note text
     */
    static String makeNote(String studentName, int score) {
        return studentName + ": " + score;
    }

    // Run the first custom action
    static void actionOne() {
        // Add an action here
    }

    // Run the second custom action
    static void actionTwo() {
        // Add another action here
    }
}
`;

export const blueJMainStarterCode = `import java.util.ArrayList;

/**
 * @brief Demonstrate a small BlueJ object-oriented project
 */
public class Main {
    /**
     * @brief Build and preview a small object-oriented BlueJ project
     *
     * @param args Command-line arguments
     */
    public static void main(String[] args) {
        String studentName = "Ada";
        int gradeLevel = 9;
        ArrayList<Integer> scores = new ArrayList<>();
        scores.add(88);
        scores.add(94);

        // Open this project in BlueJ to inspect the Student object directly
        Student student = new Student(studentName, gradeLevel);
        student.addScore(scores.get(0));
        student.addScore(scores.get(1));
        student.printSummary();

        // Mirror the same state with console-friendly browser output
        System.out.println(studentName + " is in grade " + gradeLevel);
        System.out.println("Average: " + averageScore(scores));
    }

    /**
     * @brief Calculate the average score for a list of grades
     *
     * @param scores Scores to average
     *
     * @return Average score or 0 when the list is empty
     */
    static double averageScore(ArrayList<Integer> scores) {
        // Avoid dividing by zero when no scores have been recorded
        if (scores.isEmpty()) {
            return 0;
        }

        int total = 0;

        // Add each score into the running total
        for (int score : scores) {
            total += score;
        }

        return (double) total / scores.size();
    }
}
`;

export const blueJStudentStarterCode = `import java.util.ArrayList;

/**
 * @brief Store one student's grade level and score history
 */
public class Student {
    private final String name;
    private final int gradeLevel;
    private final ArrayList<Integer> scores;

    /**
     * @brief Create a student with an empty score list
     *
     * @param name Student name
     *
     * @param gradeLevel Student grade level
     */
    public Student(String name, int gradeLevel) {
        this.name = name;
        this.gradeLevel = gradeLevel;
        this.scores = new ArrayList<>();
    }

    /**
     * @brief Add one score to the student record
     *
     * @param score Score to add
     */
    public void addScore(int score) {
        scores.add(score);
    }

    /**
     * @brief Calculate the student's average score
     *
     * @return Average score or 0 when the list is empty
     */
    public double averageScore() {
        // Avoid dividing by zero when no scores have been recorded
        if (scores.isEmpty()) {
            return 0;
        }

        int total = 0;

        // Add each score into the running total
        for (int score : scores) {
            total += score;
        }

        return (double) total / scores.size();
    }

    /**
     * @brief Print the student summary to the console
     */
    public void printSummary() {
        System.out.println(name + " is in grade " + gradeLevel);
        System.out.println("Average: " + averageScore());
    }
}
`;

export const blueJReadmeStarterText = `BlueJ Java Project

This folder is ready to open in BlueJ after downloading it from the Classes Code IDE.

Start with Main.java, then inspect Student.java to see the object's fields and methods.
The browser Run button previews the same state with console-friendly code in Main.java.

BlueJ: https://www.bluej.org/
BlueJ source: https://github.com/k-pet-group/BlueJ-Greenfoot
`;

export const karelStarterCode = `import kareltherobot.UrRobot;
import kareltherobot.World;
import kareltherobot.Directions;

/**
 * @brief Demonstrate a Karel robot program with a loaded world file
 */
public class Algo implements Directions {
    /**
     * @brief Move one robot through the sample world
     *
     * @param args Command-line arguments
     */
    public static void main(String[] args) {
        // Start Sam at street 6 avenue 7 facing east with no beepers
        UrRobot sam = new UrRobot(6, 7, East, 0);

        // Turn Sam around before moving west
        sam.turnLeft();
        sam.turnLeft();

        // Move Sam three corners across the world
        sam.move();
        sam.move();
        sam.move();
    }

    // Load the Karel world before the robot program runs
    static {
        World.setVisible(true);
        World.readWorld("world.txt");
    }
}
`;

export const karelStarterWorld = `rows=10
cols=10
wall 4 4 east
wall 4 5 south
wall 5 7 east
wall 7 4 north
wall 7 4 east
wall 7 5 north
wall 7 6 north
wall 7 7 north
wall 6 7 east
wall 5 4 east
wall 5 5 south
wall 5 6 south
wall 5 7 south
beeper 6 9 1
`;

export const karelOutlineStarterCode = `/**
 * @brief Organize a CodeHS-style Karel program with helper methods
 */
public class MyProgram extends SuperKarel {
    /**
     * @brief Run the main Karel command sequence
     */
    public void run() {
        // Move once when the path is open and this corner has no balls
        if (frontIsClear() && noBallsPresent()) {
            move();
        }

        // Continue moving until Karel reaches a blocked edge
        while (frontIsClear()) {
            move();
        }

        // Face the opposite direction before the program ends
        turnAround();
    }

    // Rotate Karel right using three left turns
    private void turnRight() {
        turnLeft();
        turnLeft();
        turnLeft();
    }

    // Rotate Karel to face the opposite direction
    private void turnAround() {
        turnLeft();
        turnLeft();
    }
}
`;

export const karelOutlineWorld = `rows=5
cols=5
beeper 1 4 1
`;

export const pgzeroOutlineStarterCode = `WIDTH = 640
HEIGHT = 400

#####################
###   CONSTANTS   ###
#####################
PLAYER_SPEED = 4
ENEMY_SPEED = 2
TITLE_POSITION = (24, 24)
TITLE_SIZE = 32
TITLE_COLOR = "white"


#####################
###   FUNCTIONS   ###
#####################
# Draw the current game frame
def draw():
    screen.clear()
    screen.draw.text(
        "Game title here",
        TITLE_POSITION,
        color=TITLE_COLOR,
        fontsize=TITLE_SIZE
    )
    player.draw()

    # Draw other actors and UI here

# Update player, enemies, score, and game state
def update():
    pass

# Run the first input action
def action_one():
    pass

# Run the second input action
def action_two():
    pass

# Restore the game to its starting state
def reset_game():
    pass


#####################
###   VARIABLES   ###
#####################
# Global Variables
player = Actor("student", (WIDTH / 2, HEIGHT / 2))
score = 0
game_over = False

###   MORE VARIABLES HERE AS NEEDED   ###

# List of Actors
actors = []
# Create each extra actor before the game loop starts
for actor_index in range(0):
    new_actor = Actor("student", (WIDTH / 2, HEIGHT / 2))
    # Actor attributes here
    actors.append(new_actor)


###########################
###   EVENT HANDLERS   ###
###########################
def on_key_down(key):
    # Route space and return keys to named actions
    if key == keys.SPACE:
        action_one()

    # Route return to the second named action
    elif key == keys.RETURN:
        action_two()

# Add other handlers here, such as on_mouse_down(pos)
`;

export const pgzeroCourseStarterCode = `# Pygame Zero reads WIDTH and HEIGHT when the game starts
WIDTH = 640
HEIGHT = 400
`;

export const pgzeroStudentSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
	<rect width="120" height="120" rx="26" fill="#5eead4"/>
	<circle cx="42" cy="48" r="8" fill="#0f172a"/>
	<circle cx="78" cy="48" r="8" fill="#0f172a"/>
	<path d="M36 75c13 14 35 14 48 0" fill="none" stroke="#0f172a" stroke-linecap="round" stroke-width="8"/>
</svg>
`;

export const dataScienceSampleCsv = `student,pre,post
Ari,62,81
Bao,71,85
Cleo,58,76
Dev,80,90
`;

export const dataScienceStarterCode = `import matplotlib.pyplot as plt
import pandas as pd

DATA_FILE = "scores.csv"
FIGURE_SIZE = (7, 4)
BAR_COLOR = "#0f766e"

scores = pd.read_csv(DATA_FILE)

# Store the growth calculation in a named column for reuse
scores["growth"] = scores["post"] - scores["pre"]
print(scores)
print()
print("Average growth:", round(scores["growth"].mean(), 2))

# Build the chart from named configuration values
plt.figure(figsize=FIGURE_SIZE)
plt.bar(scores["student"], scores["growth"], color=BAR_COLOR)
plt.title("Growth from pre-check to post-check")
plt.xlabel("Student")
plt.ylabel("Point growth")
plt.tight_layout()
`;

export function getPythonIdeModeLabel(mode: PythonIdeMode) {
	if (mode === "data") return "Data / AI";
	if (mode === "java") return "Java";
	if (mode === "karel") return "Karel Java";
	if (mode === "pgzero") return "PyGame Zero";
	if (mode === "turtle") return "Turtle";
	return "Python";
}

export function isPythonIdeBlueJProject(
	project: Pick<
		PythonIdeProject,
		"courseProjectKey" | "files" | "mode" | "starterLabel" | "title"
	>
) {
	if (project.mode !== "java") return false;

	const starterLabel = project.starterLabel?.toLowerCase() ?? "";
	const title = project.title.toLowerCase();
	return (
		project.courseProjectKey === "ide-template:bluej" ||
		starterLabel.includes("bluej") ||
		title.includes("bluej") ||
		project.files.some(file => file.name.toLowerCase() === "package.bluej")
	);
}

export function getPythonIdeProjectKindLabel(
	project: Pick<
		PythonIdeProject,
		"courseProjectKey" | "files" | "mode" | "starterLabel" | "title"
	>
) {
	return isPythonIdeBlueJProject(project)
		? "BlueJ Java"
		: getPythonIdeModeLabel(project.mode);
}

function getDemoStarterCode(mode: PythonIdeMode) {
	if (mode === "data") return dataScienceStarterCode;
	if (mode === "java") return javaStarterCode;
	if (mode === "karel") return karelStarterCode;
	if (mode === "pgzero") return pgzeroStarterCode;
	if (mode === "turtle") return turtleStarterCode;
	return pythonStarterCode;
}

function clonePythonIdeFiles(files: PythonIdeFile[]) {
	return files.map(file => ({
		name: file.name,
		content: file.content,
		encoding: file.encoding
	}));
}

function getBlankStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	if (mode === "pgzero") return getCourseStarterFiles(mode);
	if (mode === "java") {
		return [
			{
				name: "Main.java",
				content: ""
			}
		];
	}
	if (mode === "karel") return getCourseStarterFiles(mode);

	return [
		{
			name: "main.py",
			content: ""
		}
	];
}

function getCourseStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	if (mode === "java") {
		return [
			{
				name: "Main.java",
				content: javaStarterCode
			}
		];
	}

	if (mode === "karel") {
		return [
			{
				name: "Algo.java",
				content: karelStarterCode
			},
			{
				name: "world.txt",
				content: karelStarterWorld
			}
		];
	}

	if (mode === "pgzero") {
		return [
			{
				name: "main.py",
				content: pgzeroCourseStarterCode
			}
		];
	}

	return getBlankStarterFiles(mode);
}

function getDemoStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	if (mode === "java" || mode === "karel") return getCourseStarterFiles(mode);

	const files = [
		{
			name: "main.py",
			content: getDemoStarterCode(mode)
		}
	];

	if (mode === "data") {
		files.push({
			name: "scores.csv",
			content: dataScienceSampleCsv
		});
	}

	if (mode === "pgzero") {
		files.push({
			name: "images/student.svg",
			content: pgzeroStudentSvg
		});
	}

	return files;
}

function getOutlineStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	if (mode === "java") {
		return [
			{
				name: "Main.java",
				content: javaOutlineStarterCode
			}
		];
	}

	if (mode === "karel") {
		return [
			{
				name: "MyProgram.java",
				content: karelOutlineStarterCode
			},
			{
				name: "world.txt",
				content: karelOutlineWorld
			}
		];
	}

	const files = [
		{
			name: "main.py",
			content:
				mode === "pgzero"
					? pgzeroOutlineStarterCode
					: pythonLevel1OutlineStarterCode
		}
	];

	if (mode === "pgzero") {
		files.push({
			name: "images/student.svg",
			content: pgzeroStudentSvg
		});
	}

	return files;
}

function getBlueJStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	if (mode !== "java") return getOutlineStarterFiles(mode);

	return [
		{
			name: "Main.java",
			content: blueJMainStarterCode
		},
		{
			name: "Student.java",
			content: blueJStudentStarterCode
		},
		{
			name: "README.TXT",
			content: blueJReadmeStarterText
		}
	];
}

function getStarterFilesForTemplate(
	mode: PythonIdeMode,
	template: PythonIdeProjectTemplate
) {
	if (template === "bluej") return getBlueJStarterFiles(mode);
	if (template === "demo") return getDemoStarterFiles(mode);
	if (template === "outline") return getOutlineStarterFiles(mode);
	if (template === "course") return getCourseStarterFiles(mode);
	return getBlankStarterFiles(mode);
}

export function resolvePythonIdeActiveFileName(
	files: PythonIdeFile[],
	preferredFileName?: string
) {
	return (
		files.find(file => file.name === preferredFileName)?.name ??
		files.find(file => file.name === "Main.java")?.name ??
		files.find(file => file.name === "Algo.java")?.name ??
		files.find(file => file.name === "main.py")?.name ??
		files.find(file => isPythonIdeJavaFile(file.name))?.name ??
		files.find(file => isPythonIdePythonFile(file.name))?.name ??
		files[0]?.name ??
		"main.py"
	);
}

function projectTitleForMode(
	mode: PythonIdeMode,
	template: PythonIdeProjectTemplate = "blank"
) {
	if (template === "bluej" && mode === "java") return "BlueJ Java Project";

	if (template === "outline") {
		if (mode === "turtle") return "Python Level 1 Outline";
		if (mode === "pgzero") return "PyGame Zero Outline";
		return `${getPythonIdeModeLabel(mode)} Outline`;
	}

	return mode === "data"
		? "Data / AI Notebook"
		: mode === "java"
			? "Java Practice"
			: mode === "karel"
				? "Karel Java World"
				: mode === "pgzero"
					? "PyGame Zero Game"
					: mode === "turtle"
						? "Turtle Drawing"
						: "Python Practice";
}

export function createPythonIdeProject(
	mode: PythonIdeMode = "python",
	options: CreatePythonIdeProjectOptions = {}
): PythonIdeProject {
	const now = new Date().toISOString();
	const template = options.template ?? "blank";
	const files = options.files?.length
		? clonePythonIdeFiles(options.files)
		: getStarterFilesForTemplate(mode, template);
	return {
		_id: `local-${crypto.randomUUID()}`,
		title: options.title ?? projectTitleForMode(mode, template),
		mode,
		files,
		activeFileName: resolvePythonIdeActiveFileName(files),
		courseID: options.courseID,
		courseProjectKey: options.courseProjectKey,
		courseProjectTitle: options.courseProjectTitle,
		starterLabel: options.starterLabel,
		starterUrl: options.starterUrl,
		shared: false,
		sharedSourceID: options.sharedSourceID,
		createdAt: now,
		updatedAt: now
	};
}

export function pythonIdeProjectToPayload(
	project: PythonIdeProject
): PythonIdeProjectPayload {
	const payload: PythonIdeProjectPayload = {
		title: project.title.trim() || "Untitled Code Project",
		mode: project.mode,
		files: project.files,
		activeFileName: resolvePythonIdeActiveFileName(
			project.files,
			project.activeFileName
		),
		courseID: project.courseID,
		courseProjectKey: project.courseProjectKey,
		courseProjectTitle: project.courseProjectTitle,
		starterLabel: project.starterLabel,
		starterUrl: project.starterUrl
	};
	if (isValidPythonIdeShareID(project.sharedSourceID)) {
		payload.sharedSourceID = project.sharedSourceID;
	}
	return payload;
}

export function pythonIdeStorageKey(userID?: string | null) {
	return `${pythonIdeStorageNamespace}:${userID || "anonymous"}`;
}

export function normalizePythonFileName(
	value: string,
	defaultExtension = ".py"
) {
	const cleaned = value
		.trim()
		.replaceAll("\\", "/")
		.replace(/^\.\/+/, "")
		.replace(/\/+/g, "/");
	if (!cleaned) return "";
	const segments = cleaned
		.split("/")
		.map(segment => segment.trim().replaceAll(WHITESPACE_RE, "_"))
		.filter(Boolean);
	if (!segments.length) return "";
	const fileName = segments[segments.length - 1] ?? "";
	const extensionMatch = fileName.match(FILE_EXTENSION_RE);
	if (!extensionMatch) return `${segments.join("/")}${defaultExtension}`;
	const extension = extensionMatch[0].toLowerCase();
	const stem = fileName.slice(0, -extensionMatch[0].length);
	segments[segments.length - 1] = `${stem}${extension}`;
	return segments.join("/");
}

export function isPythonIdeRuntimeReservedPath(value: string) {
	const normalized = value.trim().replaceAll("\\", "/").toLowerCase();
	if (!normalized) return false;
	if (PYTHON_IDE_RUNTIME_RESERVED_FILE_NAMES.has(normalized)) return true;

	const root = normalized.split("/")[0] ?? "";
	return PYTHON_IDE_RUNTIME_RESERVED_ROOTS.has(root);
}

export function isValidPythonFileName(value: string) {
	if (!value || value.length > 80) return false;
	if (value.startsWith("/") || value.includes("\\") || value.includes("//"))
		return false;

	const segments = value.split("/");
	if (
		segments.some(
			segment =>
				!segment ||
				segment === "." ||
				segment === ".." ||
				!SAFE_FILE_SEGMENT_RE.test(segment)
		)
	) {
		return false;
	}

	if (isPythonIdeRuntimeReservedPath(value)) return false;

	if (CODE_EXTENSION_RE.test(value)) {
		const rootDirectory = segments[0]?.toLowerCase();
		return !rootDirectory || !ASSET_DIRECTORY_NAMES.has(rootDirectory);
	}

	if (segments.length === 1) return ROOT_TEXT_FILE_RE.test(value);
	if (segments.length !== 2) return false;
	return IMAGE_FILE_RE.test(value) || AUDIO_FILE_RE.test(value);
}

export function isPythonIdePythonFile(value: string) {
	return PYTHON_EXTENSION_RE.test(value);
}

export function isPythonIdeJavaFile(value: string) {
	return JAVA_EXTENSION_RE.test(value);
}

export function isPythonIdeRunnableFile(
	value: string,
	mode: PythonIdeMode = "python"
) {
	return mode === "java" || mode === "karel"
		? isPythonIdeJavaFile(value)
		: isPythonIdePythonFile(value);
}

export function isPythonIdeTextFile(value: string) {
	return TEXT_FILE_RE.test(value);
}

export function isPythonIdeBinaryAssetFile(
	file: Pick<PythonIdeFile, "encoding">
) {
	return file.encoding === "base64";
}

export function normalizeImportedPythonIdeFileName(value: string) {
	const baseName = value.split(/[\\/]/).pop() ?? value;
	const normalized = normalizePythonFileName(baseName);
	if (IMAGE_EXTENSION_RE.test(normalized)) return `images/${normalized}`;
	if (SOUND_EXTENSION_RE.test(normalized)) return `sounds/${normalized}`;
	if (MUSIC_EXTENSION_RE.test(normalized)) return `music/${normalized}`;
	return normalized;
}

export function getPythonIdeFileMimeType(value: string) {
	const extension = value.match(FILE_EXTENSION_RE)?.[0]?.toLowerCase();
	if (extension === ".gif") return "image/gif";
	if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
	if (extension === ".mp3") return "audio/mpeg";
	if (extension === ".ogg") return "audio/ogg";
	if (extension === ".png") return "image/png";
	if (extension === ".svg") return "image/svg+xml";
	if (extension === ".wav") return "audio/wav";
	if (extension === ".webp") return "image/webp";
	return "";
}

export function getPythonIdeAssetDataUrl(file: PythonIdeFile) {
	const mimeType = getPythonIdeFileMimeType(file.name);
	if (!mimeType) return "";
	if (file.encoding === "base64")
		return `data:${mimeType};base64,${file.content}`;
	if (mimeType === "image/svg+xml") {
		return `data:${mimeType};charset=utf-8,${encodeURIComponent(file.content)}`;
	}
	return "";
}

export function getPythonIdeFileKindLabel(value: string) {
	const extension = value.match(FILE_EXTENSION_RE)?.[0]?.toLowerCase();
	if (extension === ".csv") return "CSV";
	if (extension === ".java") return "Java";
	if (extension === ".json") return "JSON";
	if (extension === ".md") return "Markdown";
	if (extension === ".txt") return "Text";
	if (IMAGE_EXTENSION_RE.test(value)) return "Image";
	if (value.startsWith("music/")) return "Music";
	if (AUDIO_FILE_RE.test(value)) return "Sound";
	return "Python";
}

export function getPythonIdeDefaultFileContent(fileName: string) {
	const extension = fileName.match(FILE_EXTENSION_RE)?.[0]?.toLowerCase();
	if (extension === ".csv") return "name,value\nsample,1\n";
	if (extension === ".java")
		return "/**\n * @brief Write a small Java console program\n */\npublic class Main {\n    /**\n     * @brief Run the Java program\n     *\n     * @param args Command-line arguments\n     */\n    public static void main(String[] args) {\n        \n    }\n}\n";
	if (extension === ".json") return '{\n\t"items": []\n}\n';
	if (extension === ".md") return "# Notes\n\n";
	if (extension === ".txt") return "";
	return "# Add your Python code here.\n";
}

function baseName(path: string) {
	return path.split("/").filter(Boolean).at(-1) ?? path;
}

function safeProjectFileNameFromStarterPath(
	path: string,
	resourceBasePath: string,
	usedFileNames: Set<string>
) {
	const basePath = resourceBasePath.replace(/\/+$/, "");
	const relativePath =
		basePath && path.startsWith(`${basePath}/`)
			? path.slice(basePath.length + 1)
			: path;
	const normalizedRelativePath = relativePath
		.replace(STARTER_RELATIVE_PREFIX_RE, "")
		.replace(/^\/+/, "");
	const candidatePath = normalizePythonFileName(normalizedRelativePath);
	let fileName = isValidPythonFileName(candidatePath)
		? candidatePath
		: normalizePythonFileName(baseName(normalizedRelativePath));

	if (!isValidPythonFileName(fileName)) return "";

	if (usedFileNames.has(fileName)) {
		const extension = fileName.match(FILE_EXTENSION_RE)?.[0] ?? "";
		const stem = extension
			? fileName.slice(0, -extension.length)
			: fileName;
		let duplicateIndex = 2;
		while (usedFileNames.has(`${stem}_${duplicateIndex}${extension}`)) {
			duplicateIndex += 1;
		}
		fileName = `${stem}_${duplicateIndex}${extension}`;
	}

	usedFileNames.add(fileName);
	return fileName;
}

export async function loadPythonIdeStarterFilesFromGitHub(
	starterUrl: string
): Promise<PythonIdeFile[]> {
	const resource = parseGitHubResource(starterUrl);
	if (!resource) {
		throw new Error(
			"Only public GitHub starter links can open in the IDE."
		);
	}

	const previewFiles = await listPreviewFiles(starterUrl);
	const usedFileNames = new Set<string>();
	const starterFiles: PythonIdeFile[] = [];

	for (const file of previewFiles) {
		const name = safeProjectFileNameFromStarterPath(
			file.path,
			resource.path,
			usedFileNames
		);
		if (!name || !isPythonIdeTextFile(name)) continue;

		const preview = await loadPreviewFile(file);
		starterFiles.push({
			name,
			content: preview.content,
			encoding: "text"
		});
	}

	const runnableFileIndex = starterFiles.findIndex(file =>
		CODE_EXTENSION_RE.test(file.name)
	);
	if (runnableFileIndex <= 0) return starterFiles;

	const [runnableFile] = starterFiles.splice(runnableFileIndex, 1);
	if (runnableFile) starterFiles.unshift(runnableFile);
	return starterFiles;
}

export function getPythonIdeRunnableFile(
	project: Pick<PythonIdeProject, "activeFileName" | "files"> &
		Partial<Pick<PythonIdeProject, "mode">>
) {
	const mode = project.mode ?? "python";
	if (mode === "java") return getJavaIdeRunnableFile(project);
	if (mode === "karel") return getKarelIdeRunnableFile(project);

	return (
		project.files.find(
			file =>
				file.name === project.activeFileName &&
				isPythonIdeRunnableFile(file.name, mode)
		) ??
		project.files.find(file => isPythonIdeRunnableFile(file.name, mode)) ??
		null
	);
}

function getJavaIdeRunnableFile(
	project: Pick<PythonIdeProject, "activeFileName" | "files">
) {
	const javaFiles = project.files.filter(file =>
		isPythonIdeJavaFile(file.name)
	);
	const activeFile = javaFiles.find(
		file => file.name === project.activeFileName
	);
	const mainFile = javaFiles.find(file => file.name === "Main.java");

	return (
		(activeFile && hasJavaMainMethod(activeFile)
			? activeFile
			: undefined) ||
		mainFile ||
		javaFiles.find(hasJavaMainMethod) ||
		activeFile ||
		javaFiles[0] ||
		null
	);
}

function getKarelIdeRunnableFile(
	project: Pick<PythonIdeProject, "activeFileName" | "files">
) {
	const javaFiles = project.files.filter(file =>
		isPythonIdeJavaFile(file.name)
	);
	const activeFile = javaFiles.find(
		file => file.name === project.activeFileName
	);
	const myProgramFile = javaFiles.find(
		file => file.name === "MyProgram.java"
	);
	const algoFile = javaFiles.find(file => file.name === "Algo.java");

	return (
		(activeFile && isLikelyKarelEntryFile(activeFile)
			? activeFile
			: undefined) ||
		myProgramFile ||
		algoFile ||
		javaFiles.find(isLikelyKarelEntryFile) ||
		activeFile ||
		javaFiles[0] ||
		null
	);
}

function hasJavaMainMethod(file: Pick<PythonIdeFile, "content">) {
	return JAVA_MAIN_METHOD_RE.test(javaEntryPointSearchText(file));
}

function isLikelyKarelEntryFile(file: Pick<PythonIdeFile, "content">) {
	const searchText = javaEntryPointSearchText(file);
	return (
		JAVA_MAIN_METHOD_RE.test(searchText) ||
		KAREL_RUN_METHOD_RE.test(searchText)
	);
}

function javaEntryPointSearchText(file: Pick<PythonIdeFile, "content">) {
	return file.content.replace(JAVA_ENTRY_POINT_IGNORED_TEXT_RE, " ");
}

export function loadLocalPythonProjects(userID?: string | null) {
	if (typeof window === "undefined") return [];

	try {
		const raw = window.localStorage.getItem(pythonIdeStorageKey(userID));
		if (!raw) return [];
		const parsed = JSON.parse(raw) as PythonIdeProject[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export async function loadLocalPythonProjectsAsync(userID?: string | null) {
	const key = pythonIdeStorageKey(userID);
	const storedProjects = await readIndexedDbPythonProjects(key);
	const legacyProjects = loadLocalPythonProjects(userID);

	if (storedProjects && legacyProjects.length) {
		const storedProjectsUpdatedAt =
			pythonIdeProjectSetUpdatedAt(storedProjects);
		const legacyProjectsUpdatedAt =
			pythonIdeProjectSetUpdatedAt(legacyProjects);
		if (legacyProjectsUpdatedAt > storedProjectsUpdatedAt) {
			await saveLocalPythonProjectsAsync(legacyProjects, userID);
			return legacyProjects;
		}
		return storedProjects;
	}

	if (storedProjects) return storedProjects;

	if (legacyProjects.length) {
		await saveLocalPythonProjectsAsync(legacyProjects, userID);
	}
	return legacyProjects;
}

export function saveLocalPythonProjects(
	projects: PythonIdeProject[],
	userID?: string | null
) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(
		pythonIdeStorageKey(userID),
		JSON.stringify(projects)
	);
}

function pythonIdeProjectSetUpdatedAt(projects: PythonIdeProject[]) {
	return projects.reduce((latest, project) => {
		const updatedAt = Date.parse(
			project.updatedAt ?? project.createdAt ?? ""
		);
		return Number.isFinite(updatedAt)
			? Math.max(latest, updatedAt)
			: latest;
	}, 0);
}

export async function saveLocalPythonProjectsAsync(
	projects: PythonIdeProject[],
	userID?: string | null
) {
	const key = pythonIdeStorageKey(userID);

	try {
		await writeIndexedDbPythonProjects(key, projects);
		saveLegacyLocalPythonProjectsMirror(projects, userID);
	} catch (indexedDbError) {
		try {
			saveLocalPythonProjects(projects, userID);
		} catch {
			throw new Error(
				`Could not save Code IDE projects locally. Browser project storage may be full or unavailable. (${formatStorageError(indexedDbError)})`
			);
		}
	}
}

export function clearLocalPythonProjects(userID?: string | null) {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(pythonIdeStorageKey(userID));
}

export async function clearLocalPythonProjectsAsync(userID?: string | null) {
	const key = pythonIdeStorageKey(userID);
	await deleteIndexedDbPythonProjects(key).catch(() => undefined);
	clearLocalPythonProjects(userID);
}

async function readIndexedDbPythonProjects(key: string) {
	try {
		const db = await openPythonIdeStorageDb();
		const transaction = db.transaction(
			PYTHON_IDE_PROJECT_STORE,
			"readonly"
		);
		const record = await indexedDbRequest<
			PythonIdeProjectStorageRecord | undefined
		>(transaction.objectStore(PYTHON_IDE_PROJECT_STORE).get(key));
		await indexedDbTransactionDone(transaction);
		return Array.isArray(record?.projects) ? record.projects : null;
	} catch {
		return null;
	}
}

async function writeIndexedDbPythonProjects(
	key: string,
	projects: PythonIdeProject[]
) {
	const db = await openPythonIdeStorageDb();
	const transaction = db.transaction(PYTHON_IDE_PROJECT_STORE, "readwrite");
	await indexedDbRequest(
		transaction.objectStore(PYTHON_IDE_PROJECT_STORE).put({
			key,
			projects,
			updatedAt: new Date().toISOString()
		} satisfies PythonIdeProjectStorageRecord)
	);
	await indexedDbTransactionDone(transaction);
}

async function deleteIndexedDbPythonProjects(key: string) {
	const db = await openPythonIdeStorageDb();
	const transaction = db.transaction(PYTHON_IDE_PROJECT_STORE, "readwrite");
	await indexedDbRequest(
		transaction.objectStore(PYTHON_IDE_PROJECT_STORE).delete(key)
	);
	await indexedDbTransactionDone(transaction);
}

function openPythonIdeStorageDb() {
	if (typeof window === "undefined" || !window.indexedDB) {
		return Promise.reject(new Error("IndexedDB is unavailable."));
	}

	pythonIdeStorageDbPromise ??= new Promise<IDBDatabase>(
		(resolve, reject) => {
			const request = window.indexedDB.open(
				PYTHON_IDE_INDEXED_DB_NAME,
				PYTHON_IDE_INDEXED_DB_VERSION
			);

			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains(PYTHON_IDE_PROJECT_STORE)) {
					db.createObjectStore(PYTHON_IDE_PROJECT_STORE, {
						keyPath: "key"
					});
				}
			};
			request.onsuccess = () => {
				const db = request.result;
				db.onversionchange = () => {
					db.close();
					pythonIdeStorageDbPromise = null;
				};
				resolve(db);
			};
			request.onerror = () =>
				reject(request.error ?? new Error("Could not open IndexedDB."));
			request.onblocked = () =>
				reject(
					new Error(
						"Code IDE project storage is blocked by another tab."
					)
				);
		}
	).catch(error => {
		pythonIdeStorageDbPromise = null;
		throw error;
	});

	return pythonIdeStorageDbPromise;
}

function indexedDbRequest<T>(request: IDBRequest<T>) {
	return new Promise<T>((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () =>
			reject(request.error ?? new Error("IndexedDB request failed."));
	});
}

function indexedDbTransactionDone(transaction: IDBTransaction) {
	return new Promise<void>((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onerror = () =>
			reject(
				transaction.error ?? new Error("IndexedDB transaction failed.")
			);
		transaction.onabort = () =>
			reject(
				transaction.error ?? new Error("IndexedDB transaction aborted.")
			);
	});
}

function saveLegacyLocalPythonProjectsMirror(
	projects: PythonIdeProject[],
	userID?: string | null
) {
	try {
		saveLocalPythonProjects(projects, userID);
	} catch {
		// IndexedDB remains the primary store; the mirror is best-effort.
	}
}

function formatStorageError(error: unknown) {
	return error instanceof Error ? error.message : "storage unavailable";
}

export async function fetchPythonIdeProjects() {
	const { data } = await api.get<{ projects: PythonIdeProject[] }>(
		"/users/loggedin/python-projects"
	);
	return data.projects;
}

export async function fetchSharedPythonIdeProject(shareID: string) {
	if (!isValidPythonIdeShareID(shareID)) {
		throw new Error("Invalid share link.");
	}

	const { data } = await api.get<{ project: SharedPythonIdeProject }>(
		`/users/python-projects/shared/${encodeURIComponent(shareID)}`
	);
	return data.project;
}

export async function fetchVisiblePythonIdeProjectReviews() {
	const { data } = await api.get<{ reviews: PythonIdeProjectReview[] }>(
		"/users/loggedin/python-project-reviews"
	);
	return data.reviews;
}

export async function fetchManagedPythonIdeProjects(userID: string) {
	const { data } = await api.get<{ projects: ManagedPythonIdeProject[] }>(
		`/users/${userID}/python-projects`
	);
	return data.projects;
}

export async function createRemotePythonIdeProject(
	payload: PythonIdeProjectPayload
) {
	const { data } = await api.post<{ project: PythonIdeProject }>(
		"/users/loggedin/python-projects",
		payload
	);
	return data.project;
}

export async function createPythonIdeProjectReview(
	userID: string,
	projectID: string
) {
	const { data } = await api.post<{
		project: PythonIdeProject;
		review: PythonIdeProjectReview;
	}>(`/users/${userID}/python-projects/${projectID}/review`, {});
	return data;
}

export async function updatePythonIdeProjectReview(
	userID: string,
	projectID: string,
	reviewID: string,
	payload: {
		activeFileName?: string;
		files?: PythonIdeFile[];
		note?: string;
		refreshFromSource?: boolean;
		visibleToStudent?: boolean;
	}
) {
	const { data } = await api.put<{
		project: PythonIdeProject;
		review: PythonIdeProjectReview;
	}>(
		`/users/${userID}/python-projects/${projectID}/review/${reviewID}`,
		payload
	);
	return data;
}

export async function updateRemotePythonIdeProject(
	projectID: string,
	payload: PythonIdeProjectPayload
) {
	const { data } = await api.put<{ project: PythonIdeProject }>(
		`/users/loggedin/python-projects/${projectID}`,
		payload
	);
	return data.project;
}

export async function updateRemotePythonIdeProjectShare(
	projectID: string,
	shared: boolean
) {
	const { data } = await api.put<{ project: PythonIdeProject }>(
		`/users/loggedin/python-projects/${projectID}/share`,
		{ shared }
	);
	return data.project;
}

export async function deleteRemotePythonIdeProject(projectID: string) {
	await api.delete(`/users/loggedin/python-projects/${projectID}`);
}
