export const x = "";

const results = await Deno.readTextFile("./input.txt");
const lines = results.split("\n");

let overlapping = 0;

lines.forEach((line) => {
  const pairs = line.split(",");
  const elfOne = pairs[0].split("-").map((i) => parseInt(i));
  const elfTwo = pairs[1].split("-").map((i) => parseInt(i));

  if (elfOne[0] <= elfTwo[1] && elfOne[1] >= elfTwo[0]) {
    overlapping++;
  }
});

console.log({ overlapping });
