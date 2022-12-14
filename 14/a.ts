export const x = "";

const results = await Deno.readTextFile("./input.txt");
const lines = results.split("\n");

const rockPositions = new Set<string>();

let smallestX = Infinity;
let largestX = 0;
let largestY = 0;

lines.map((path) => {
  const positions = path.split(" -> ");
  positions.map((position, index) => {
    if (index !== positions.length - 1) {
      let [startX, startY, endX, endY] = position
        .split(",")
        .map(Number)
        .concat(positions[index + 1].split(",").map(Number));

      if (startX > endX) [startX, endX] = [endX, startX];
      if (startY > endY) [startY, endY] = [endY, startY];

      if (startX < smallestX) smallestX = startX;
      if (endX > largestX) largestX = endX;
      if (endY > largestY) largestY = endY;

      if (startX !== endX) {
        for (let i = startX; i <= endX; i++) {
          rockPositions.add(`${i},${startY}`);
        }
      }

      if (startY !== endY) {
        for (let i = startY; i <= endY; i++) {
          rockPositions.add(`${startX},${i}`);
        }
      }
    }
  });
});

const sandPositions = new Set<string>();
let finished = false;

const sandStartingPosition = "500,0";
let currentSandUnit = sandStartingPosition;

while (!finished) {
  const [x, y] = currentSandUnit.split(",").map(Number);

  if (y > largestY || x > largestX || x < smallestX) {
    finished = true;
  }

  if (!rockPositions.has(`${x},${y + 1}`) && !sandPositions.has(`${x},${y + 1}`)) {
    currentSandUnit = `${x},${y + 1}`;
  } else {
    const left = `${x - 1},${y + 1}`;
    const right = `${x + 1},${y + 1}`;

    if (!rockPositions.has(left) && !sandPositions.has(left)) {
      currentSandUnit = left;
    } else if (!rockPositions.has(right) && !sandPositions.has(right)) {
      currentSandUnit = right;
    } else {
      sandPositions.add(currentSandUnit);
      currentSandUnit = sandStartingPosition;
    }
  }
}

console.log({ sandPositions: sandPositions.size });
