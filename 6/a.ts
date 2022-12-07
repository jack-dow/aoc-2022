export const x = "";

const results = await Deno.readTextFile("./input.txt");
const signals = results.split("\n");

signals.forEach((signal) => {
  const buffer = signal.split("");
  const markerSize = 4;

  for (let i = markerSize; i < buffer.length; i++) {
    if (new Set(buffer.slice(i - markerSize, i)).size === markerSize) {
      console.log(i);
      break;
    }
  }
});
