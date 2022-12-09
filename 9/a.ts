export const x = "";

const results = await Deno.readTextFile("./input.txt");
const moves = results.split("\n");

type Grid = string[][];

const grid: Grid = [];
const gridSize = 501;
const gridMiddle = Math.floor(gridSize / 2);

const headPosition = { row: gridMiddle, column: gridMiddle };
const tailPosition = { row: gridMiddle, column: gridMiddle };

// Fill the grid with 50 rows and 50 columns of empty strings
for (let i = 0; i < gridSize; i++) {
  grid.push([]);
  for (let j = 0; j < gridSize; j++) {
    if (i === gridMiddle && j === gridMiddle) {
      grid[i].push("#");
      continue;
    }
    grid[i].push("");
  }
}

function moveHead(direction: string) {
  if (direction === "R") headPosition.column++;
  if (direction === "L") headPosition.column--;
  if (direction === "U") headPosition.row--;
  if (direction === "D") headPosition.row++;
}

moves.map((move) => {
  const [direction, distance] = move.split(" ");
  console.log({ direction, distance });

  for (let i = 0; i < parseInt(distance); i++) {
    moveHead(direction);
    // IF head and tail aren't touching above, move tail up
    if (headPosition.row - tailPosition.row === -2) {
      if (headPosition.column === tailPosition.column) {
        tailPosition.row--;
      } else {
        tailPosition.row--;
        tailPosition.column += headPosition.column - tailPosition.column;
      }
    }

    // IF head and tail aren't touching below, move tail down
    if (headPosition.row - tailPosition.row === 2) {
      if (headPosition.column === tailPosition.column) {
        tailPosition.row++;
      } else {
        tailPosition.row++;
        tailPosition.column += headPosition.column - tailPosition.column;
      }
    }

    // IF head and tail aren't touching left, move tail left
    if (headPosition.column - tailPosition.column === -2) {
      if (headPosition.row === tailPosition.row) {
        tailPosition.column--;
      } else {
        tailPosition.column--;
        tailPosition.row += headPosition.row - tailPosition.row;
      }
    }

    // IF head and tail aren't touching right, move tail right
    if (headPosition.column - tailPosition.column === 2) {
      if (headPosition.row === tailPosition.row) {
        tailPosition.column++;
      } else {
        tailPosition.column++;
        tailPosition.row += headPosition.row - tailPosition.row;
      }
    }

    grid[tailPosition.row][tailPosition.column] = "#";
  }
});

// console.log({ grid });

// Count the number of # in the grid
let count = 0;
grid.map((row) => {
  row.map((column) => {
    if (column === "#") count++;
  });
});

console.log({ count });
