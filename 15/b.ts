export const x = "";

const startTime = performance.now();

const results = await Deno.readTextFile("./input.txt");
const lines = results.split("\n");

type X = number;
type Y = number;

const sensorMap = new Map<Y, Set<X>>();
const impossibleMap = new Map<Y, Set<[number, number]>>();

lines.map((line) => {
  const [sensorX, sensorY, beaconX, beaconY] = line
    .replace("Sensor at ", "")
    .replace(": closest beacon is at ", ",")
    .split(",")
    .map((char) => Number(char.trim().slice(2)));

  if (!sensorMap.has(sensorY)) {
    sensorMap.set(sensorY, new Set([sensorX]));
  } else sensorMap.get(sensorY)!.add(sensorX);

  const distance =
    Math.max(sensorX, beaconX) - Math.min(sensorX, beaconX) + Math.max(sensorY, beaconY) - Math.min(sensorY, beaconY);

  for (let i = 0; i < distance + 1; i++) {
    const rangeStart = sensorX - (distance - i);
    const rangeEnd = sensorX + (distance - i);
    if (!impossibleMap.has(sensorY + i)) {
      impossibleMap.set(sensorY + i, new Set([[rangeStart, rangeEnd]]));
    } else {
      impossibleMap.get(sensorY + i)!.add([rangeStart, rangeEnd]);
    }

    if (!impossibleMap.has(sensorY - i)) {
      impossibleMap.set(sensorY - i, new Set([[rangeStart, rangeEnd]]));
    } else {
      impossibleMap.get(sensorY - i)!.add([rangeStart, rangeEnd]);
    }
  }
});

let distressSignal: { x: number; y: number } | undefined;

Array.from(sensorMap.keys()).every((sensorY) => {
  if (sensorY >= 0 && sensorY <= 4000000 && impossibleMap.has(sensorY)) {
    const impossibleXs = impossibleMap.get(sensorY)!;

    const takenSpots = new Set<number>();

    Array.from(impossibleXs).map((ranges) => {
      for (let i = ranges[0]; i < ranges[1] + 1; i++) {
        if (i >= 0) takenSpots.add(i);
      }
    });

    const numbers = Array.from(takenSpots).sort((a, b) => a - b);
    numbers.every((num, i) => {
      if (i < numbers.length - 1) {
        if (numbers[i + 1] - num !== 1) {
          console.log("YES");
          distressSignal = { x: num + 1, y: sensorY };
          return false;
        }
        return true;
      }
    });
  }

  if (!distressSignal) return true;
  return false;
});

if (distressSignal) {
  console.log(distressSignal.x * 4000000 + distressSignal.y);
} else {
  console.log("No distress signal found");
}

const endTime = performance.now();
console.log(`Time taken: ${endTime - startTime}ms`);
