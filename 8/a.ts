export const x = "";

const results = await Deno.readTextFile("./input.txt");
const rows = results.split("\n");

type Grid = Array<Array<number>>;
let visibleTreesCount = 0;

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

const visibleGrid: Grid = grid.map((row) => row.map((_) => 0));

for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
  const row = grid[rowIndex];
  const tallestTreeInRow = Math.max(...row);
  let currentTallestTree = 0;

  for (let colIndex = 0; colIndex < row.length; colIndex++) {
    const treeHeight = row[colIndex];
    if (colIndex === 0) {
      visibleGrid[rowIndex][colIndex] = 1;
      if (treeHeight === tallestTreeInRow) break;
      currentTallestTree = treeHeight;
      continue;
    }
    if (treeHeight > currentTallestTree) {
      visibleGrid[rowIndex][colIndex] = 1;
      if (treeHeight === tallestTreeInRow) break;
      currentTallestTree = treeHeight;
    }
  }

  const rowReverse = [...row].reverse();
  const tallestTreeInRowReverse = Math.max(...rowReverse);
  let currentTallestTreeReverse = 0;

  for (let colIndex = 0; colIndex < rowReverse.length; colIndex++) {
    const treeHeight = rowReverse[colIndex];
    if (colIndex === 0) {
      visibleGrid[rowIndex][row.length - colIndex - 1] = 1;
      if (treeHeight === tallestTreeInRowReverse) break;
      currentTallestTreeReverse = treeHeight;
      continue;
    }
    if (treeHeight > currentTallestTreeReverse) {
      visibleGrid[rowIndex][row.length - colIndex - 1] = 1;
      if (treeHeight === tallestTreeInRowReverse) break;
      currentTallestTreeReverse = treeHeight;
    }
  }
}

// Create a shifted grid which has the rows as the columns and the columns as the rows
const shiftedGrid: Grid = [];

for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
  const row = grid[rowIndex];
  for (let colIndex = 0; colIndex < row.length; colIndex++) {
    if (shiftedGrid.length <= colIndex) {
      shiftedGrid.push([]);
    }
    shiftedGrid[colIndex].push(row[colIndex]);
  }
}

const visibleShiftedGrid: Grid = shiftedGrid.map((row) => row.map((_) => 0));

for (let rowIndex = 0; rowIndex < shiftedGrid.length; rowIndex++) {
  const row = shiftedGrid[rowIndex];
  const tallestTreeInRow = Math.max(...row);
  let currentTallestTree = 0;

  for (let colIndex = 0; colIndex < row.length; colIndex++) {
    const treeHeight = row[colIndex];
    if (colIndex === 0) {
      visibleShiftedGrid[rowIndex][colIndex] = 1;
      if (treeHeight === tallestTreeInRow) break;
      currentTallestTree = treeHeight;
      continue;
    }
    if (treeHeight > currentTallestTree) {
      visibleShiftedGrid[rowIndex][colIndex] = 1;
      if (treeHeight === tallestTreeInRow) break;
      currentTallestTree = treeHeight;
    }
  }

  const rowReverse = [...row].reverse();
  const tallestTreeInRowReverse = Math.max(...rowReverse);
  let currentTallestTreeReverse = 0;

  for (let colIndex = 0; colIndex < rowReverse.length; colIndex++) {
    const treeHeight = rowReverse[colIndex];
    if (colIndex === 0) {
      visibleShiftedGrid[rowIndex][row.length - colIndex - 1] = 1;
      if (treeHeight === tallestTreeInRowReverse) break;
      currentTallestTreeReverse = treeHeight;
      continue;
    }
    if (treeHeight > currentTallestTreeReverse) {
      visibleShiftedGrid[rowIndex][row.length - colIndex - 1] = 1;
      if (treeHeight === tallestTreeInRowReverse) break;
      currentTallestTreeReverse = treeHeight;
    }
  }
}

// Create a new grid which is the combination of the visibleGrid and the visibleShiftedGrid

for (let rowIndex = 0; rowIndex < visibleGrid.length; rowIndex++) {
  const row = visibleGrid[rowIndex];
  for (let colIndex = 0; colIndex < row.length; colIndex++) {
    if (row[colIndex] === 1 || visibleShiftedGrid[colIndex][rowIndex] === 1) {
      visibleTreesCount++;
    }
  }
}

console.log({ visibleTreesCount });
