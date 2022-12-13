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

const dividerPackets = [[[2]], [[6]]];
const answer = lines
  .map((pairs) => {
    const [left, right] = pairs.split("\n").map((pair) => JSON.parse(pair));
    return [left, right];
  })
  .flat()
  .concat(dividerPackets)
  .sort(comparePackets)
  .map((packet, index) => [packet, index])
  .filter(([packet]) => dividerPackets.includes(packet))
  .map(([, index]) => index + 1)
  .reduce((acc, index) => acc * index);

console.log({ answer });
