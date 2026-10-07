// Exact source byte pins and direct parser/fresh-search checks.
export const mazeSearchRevision = "3adb873179bd149b1f6ef9fddfec8557a6a71eb4";
export const mazeSearchPacks = {
	"CPPI2-Recursive-Maze-Search/starter": {
		"Makefile": "2bbf888e799dcde0a2544018b89702e1f14311879b9c1620f30e3ead6a4c77a8",
		"README.md": "90573cc5998aa63b82668980ad9a0535bbe61ec6a3485c978fe9ab64f75de502",
		"main.cpp": "c0a3aff3e83da496d37281fa360fdae5e060a877e6e0b2b1768482dfaab55974",
		"maze.cpp": "b0ad7449358b90efa0519aa5dd7bee89f887d7536675574cc823bbf3c621520e",
		"maze.h": "eeab96eb2d579aaad0898c0cdb27b09518d7759fff555100be38a5b3e104b873",
		"maze_search.cpp": "92529e2c91ecb5118444587c1e6a1a18dd667c87e39169dbd8a069c7d4784b71"
	},
	"CPPI2-Recursive-Maze-Search/solution": {
		"Makefile": "2bbf888e799dcde0a2544018b89702e1f14311879b9c1620f30e3ead6a4c77a8",
		"README.md": "90573cc5998aa63b82668980ad9a0535bbe61ec6a3485c978fe9ab64f75de502",
		"main.cpp": "c0a3aff3e83da496d37281fa360fdae5e060a877e6e0b2b1768482dfaab55974",
		"maze.cpp": "b0ad7449358b90efa0519aa5dd7bee89f887d7536675574cc823bbf3c621520e",
		"maze.h": "eeab96eb2d579aaad0898c0cdb27b09518d7759fff555100be38a5b3e104b873",
		"maze_search.cpp": "d8b141bf62f9c65bca485dfae4410438dd5544bfdb772320aadb52a966ec6349"
	}
};
export const mazeSearchOracle = "\n#include \"maze.h\"\n#include <cassert>\n#include <sstream>\n#include <stdexcept>\nusing namespace mazecourse;\nclass ReadFailure : public std::stringbuf {\n  public:\n    explicit ReadFailure(const std::string& bytes) : std::stringbuf(bytes) {}\n  protected:\n    int_type underflow() override { throw std::runtime_error(\"read failure\"); }\n};\nint main() {\n    Maze maze{{\"SE\"}, {0,0}, {0,1}};\n    const auto before = maze;\n    std::string error = \"old\";\n    for (const std::string& bytes : std::vector<std::string>{\"\", \"0 2\\nSE\\n\", \"1 2\\nSS\\n\", \"1 2\\nSE\\n\\n\", std::string(16385, 'x')}) {\n        std::istringstream input(bytes);\n        assert(!readMaze(input, maze, error));\n        assert(maze == before && !error.empty());\n    }\n    ReadFailure failure(\"1 2\\nSE\\n\");\n    std::istream failed(&failure);\n    assert(!readMaze(failed, maze, error));\n    assert(failed.bad() && maze == before && error == \"Cannot read maze input.\");\n    std::istringstream input(\"01\\t02\\r\\nSE\");\n    assert(readMaze(input, maze, error) && error.empty() && maze == before);\n    std::istringstream throwingEof(\"1 2\\nSE\\n\");\n    throwingEof.exceptions(std::ios::failbit | std::ios::badbit);\n    assert(readMaze(throwingEof, maze, error) && error.empty());\n    const auto first = solveMaze(maze);\n    assert(first.found && (first.path == std::vector<Cell>{{0,0},{0,1}}));\n    assert(solveMaze(maze) == first && maze == before);\n    Maze blocked{{\"S#E\"}, {0,0}, {0,2}};\n    const auto noPath = solveMaze(blocked);\n    assert(!noPath.found && noPath.path.empty() && noPath.entered.size() == 1);\n    assert(solveMaze(maze) == first);\n    for (const Maze& bad : std::vector<Maze>{Maze{}, Maze{{\"SE\", \"#\"},{0,0},{0,1}}, Maze{{\"SE\"},{1,0},{0,1}}, Maze{{\"SE\"},{0,0},{1,1}}, Maze{{\"SSE\"},{0,0},{0,2}}}) {\n        try { static_cast<void>(solveMaze(bad)); assert(false); }\n        catch (const std::invalid_argument&) {}\n    }\n}\n";
