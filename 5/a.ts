export const x = "";

const results = await Deno.readTextFile("./input.txt");
const lines = results.split("\n\n");
const stackInput = lines[0].split("\n").reverse();
const moves = lines[1].split("\n");

const stacks: Record<string, string[]> = {};

stackInput.forEach((line, index) => {
  if (index === 0) {
    const stackNumbers = line.trim().split("   ");
    stackNumbers.forEach((stackNumber) => {
      stacks[stackNumber] = [];
    });
  }
  if (index > 0) {
    const crates = line.match(/.{1,4}/g) || [];

    crates.forEach((crate, index) => {
      if (crate.trim()) {
        stacks[index + 1].push(crate[1]);
      }
    });
  }
});

moves.forEach((move) => {
  const movesArray = move.split(" ");
  const amount = parseInt(movesArray[1]);
  const from = movesArray[3];
  const to = movesArray[5];

  const crates = stacks[from].splice(-amount).reverse();
  stacks[to].push(...crates);
});

let output = "";

Object.keys(stacks).forEach((stack) => {
  output += stacks[stack].pop();
});

console.log(output);
