export const x = "";

const results = await Deno.readTextFile("./input.txt");
const rows = results.split("\n");

type Grid = Array<Array<number>>;

const grid: Grid = [];

for (let row = 0; row < rows.length; row++) {
  const trees = rows[row].split("");

  trees.map((tree) => {
    // console.log({ tree, row, col });
    if (grid.length <= row) {
      grid.push([]);
    }
    grid[row].push(parseInt(tree));
  });
}

let highestScenicScore = 0;

function calculateScenicScore(startingRow: number, startingCol: number) {
  const startingTreeHeight = grid[startingRow][startingCol];
  let viewLeft = 0;
  let viewRight = 0;
  let viewUp = 0;
  let viewDown = 0;

  function lookLeft(row: number, col: number) {
    if (col === 0) return;

    if (grid[row][col - 1] >= startingTreeHeight) {
      viewLeft++;
      return;
    }

    if (grid[row][col - 1] < startingTreeHeight) {
      viewLeft++;
      lookLeft(row, col - 1);
    }
  }

  function lookRight(row: number, col: number) {
    if (col === grid[row].length - 1) return;

    if (grid[row][col + 1] >= startingTreeHeight) {
      viewRight++;
      return;
    }

    if (grid[row][col + 1] < startingTreeHeight) {
      viewRight++;
      lookRight(row, col + 1);
    }
  }

  function lookUp(row: number, col: number) {
    if (row === 0) return;

    if (grid[row - 1][col] >= startingTreeHeight) {
      viewUp++;
      return;
    }

    if (grid[row - 1][col] < startingTreeHeight) {
      viewUp++;
      lookUp(row - 1, col);
    }
  }

  function lookDown(row: number, col: number) {
    if (row === grid.length - 1) return;

    if (grid[row + 1][col] >= startingTreeHeight) {
      viewDown++;
      return;
    }

    if (grid[row + 1][col] < startingTreeHeight) {
      viewDown++;
      lookDown(row + 1, col);
    }
  }

  lookLeft(startingRow, startingCol);
  lookRight(startingRow, startingCol);
  lookUp(startingRow, startingCol);
  lookDown(startingRow, startingCol);

  //   console.log({
  //     startingRow,
  //     startingCol,
  //     viewUp,
  //     viewLeft,
  //     viewDown,
  //     viewRight,
  //     total: viewLeft * viewRight * viewUp * viewDown,
  //   });

  return viewLeft * viewRight * viewUp * viewDown;
}

grid.map((row, rowIndex) => {
  row.map((treeHeight, colIndex) => {
    // IF tree is on the any edge, return
    if (
      rowIndex === 0 ||
      rowIndex === grid.length - 1 ||
      colIndex === 0 ||
      colIndex === row.length - 1 ||
      treeHeight === 0
    ) {
      return;
    }

    const scenicScore = calculateScenicScore(rowIndex, colIndex);
    if (scenicScore > highestScenicScore) {
      highestScenicScore = scenicScore;
    }
  });
});

console.log({ highestScenicScore });

// console.log({ test: grid[3][2], grid });
