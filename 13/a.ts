export const x = "";

const results = await Deno.readTextFile("./input.txt");
const lines = results.split("\n\n");

type PacketData = number | Array<number | PacketData>;
type PacketDataArray = Array<number | PacketDataArray>;

function comparePackets(left: PacketData, right: PacketData): number {
  if ([left, right].every((packet) => +packet === packet)) return (left as number) - (right as number);
  [left, right] = [left, right].map((packet) => (+packet === packet ? [packet] : packet)) as PacketDataArray[];
  return (left.reduce((acc, left, index) => acc || comparePackets(left, right[index] ?? left), 0) ||
    left.length - right.length) as number;
}

let answer = 0;

lines.map((pairs, index) => {
  const [left, right] = pairs.split("\n").map((pair) => JSON.parse(pair));

  if (comparePackets(left, right) < 0) answer += index + 1;
});

console.log({ answer });
