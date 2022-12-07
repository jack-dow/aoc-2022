export const x = "";

const results = await Deno.readTextFile("./input.txt");
const signals = results.split("\n");

signals.forEach((signal) => {
  const buffer = signal.split("");
  let markerPosition = 0;

  for (let i = 0; i < buffer.length - 13; i++) {
    const marker = buffer.slice(i, i + 14).join("");

    const uniqueChars = new Set(marker).size === marker.length;
    if (uniqueChars) {
      markerPosition = i + 14;
      break;
    }
  }

  console.log(markerPosition);
});
