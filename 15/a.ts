export const x = "";

const startTime = performance.now();

const results = await Deno.readTextFile("./input.txt");
const lines = results.split("\n");

type X = number;
type Y = number;

const sensorMap = new Map<Y, Set<X>>();
const beaconMap = new Map<Y, Set<X>>();
const impossibleMap = new Map<Y, { start: number; end: number }>();

lines.map((line) => {
  const [sensorX, sensorY, beaconX, beaconY] = line
    .replace("Sensor at ", "")
    .replace(": closest beacon is at ", ",")
    .split(",")
    .map((char) => Number(char.trim().slice(2)));

  if (!sensorMap.has(sensorY)) {
    sensorMap.set(sensorY, new Set([sensorX]));
  } else sensorMap.get(sensorY)!.add(sensorX);

  if (!beaconMap.has(beaconY)) {
    beaconMap.set(beaconY, new Set([beaconX]));
  } else beaconMap.get(beaconY)!.add(beaconX);

  const distance =
    Math.max(sensorX, beaconX) - Math.min(sensorX, beaconX) + Math.max(sensorY, beaconY) - Math.min(sensorY, beaconY);

  for (let i = 0; i < distance + 1; i++) {
    if (!impossibleMap.has(sensorY + i)) {
      impossibleMap.set(sensorY + i, { start: sensorX - (distance - i), end: sensorX + (distance - i) });
    } else {
      const current = impossibleMap.get(sensorY + i)!;
      impossibleMap.set(sensorY + i, {
        start: Math.min(current.start, sensorX - (distance - i)),
        end: Math.max(current.end, sensorX + (distance - i)),
      });
    }

    if (!impossibleMap.has(sensorY - i)) {
      impossibleMap.set(sensorY - i, { start: sensorX - (distance - i), end: sensorX + (distance - i) });
    } else {
      const current = impossibleMap.get(sensorY - i)!;
      impossibleMap.set(sensorY - i, {
        start: Math.min(current.start, sensorX - (distance - i)),
        end: Math.max(current.end, sensorX + (distance - i)),
      });
    }
  }
});

if (impossibleMap.has(2000000)) {
  const { start, end } = impossibleMap.get(2000000)!;
  const sensors = sensorMap.get(2000000)?.size ?? 0;
  const beacons = beaconMap.get(2000000)?.size ?? 0;

  console.log(end - start + 1 - sensors - beacons);
}

const endTime = performance.now();
console.log(`Time taken: ${endTime - startTime}ms`);
