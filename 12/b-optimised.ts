export const x = "";

const results = await Deno.readTextFile("./input.txt");
const lines = results.split("\n");

const elevations = "abcdefghijklmnopqrstuvwxyz";
let startingPosition: { x: number; y: number } = { x: 0, y: 0 };

const grid = lines.map((line, y) =>
  line.split("").map((char, x) => {
    if (char === "S") {
      return "a";
    } else if (char === "E") {
      startingPosition = { x, y };
      return "z";
    }
    return char;
  })
);

function findMoveable(x: number, y: number) {
  const elevation = grid[y][x];
  const elevationIndex = elevations.indexOf(elevation);

  const up = grid[y - 1]?.[x];
  const down = grid[y + 1]?.[x];
  const left = grid[y][x - 1];
  const right = grid[y][x + 1];

  const upIndex = elevations.indexOf(up);
  const downIndex = elevations.indexOf(down);
  const leftIndex = elevations.indexOf(left);
  const rightIndex = elevations.indexOf(right);

  const moveable: { x: number; y: number }[] = [];

  if (up && elevationIndex <= upIndex + 1) moveable.push({ x, y: y - 1 });
  if (down && elevationIndex <= downIndex + 1) moveable.push({ x, y: y + 1 });
  if (left && elevationIndex <= leftIndex + 1) moveable.push({ x: x - 1, y });
  if (right && elevationIndex <= rightIndex + 1) moveable.push({ x: x + 1, y });

  return moveable;
}

function breadthFirstSearch(x: number, y: number) {
  const visited = new Set<string>(JSON.stringify({ x, y }));
  const queue: { x: number; y: number; moves: number }[] = [];

  queue.push({ x, y, moves: 0 });

  while (queue.length > 0) {
    const current = queue.shift();

    if (current) {
      const { x, y, moves } = current;

      if (visited.has(JSON.stringify({ x, y }))) continue;

      visited.add(JSON.stringify({ x, y }));

      if (grid[y][x] === "a") {
        console.log("found it", { moves });
        break;
      }

      const moveable = findMoveable(x, y);

      moveable.map((move) => {
        if (!visited.has(JSON.stringify({ x: move.x, y: move.y }))) {
          queue.push({ ...move, moves: moves + 1 });
        }
      });
    }
  }
}

breadthFirstSearch(startingPosition.x, startingPosition.y);
