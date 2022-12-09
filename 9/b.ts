export const x = "";

const results = await Deno.readTextFile("./input.txt");
const moves = results.split("\n");

type Position = {
  x: number;
  y: number;
};

const rope: [
  Position, // Head
  Position, // 1
  Position, // 2
  Position, // 3
  Position, // 4
  Position, // 5
  Position, // 6
  Position, // 7
  Position, // 8
  Position // 9 & Tail
] = [
  { x: 0, y: 0 }, // Head
  { x: 0, y: 0 }, // 1
  { x: 0, y: 0 }, // 2
  { x: 0, y: 0 }, // 3
  { x: 0, y: 0 }, // 4
  { x: 0, y: 0 }, // 5
  { x: 0, y: 0 }, // 6
  { x: 0, y: 0 }, // 7
  { x: 0, y: 0 }, // 8
  { x: 0, y: 0 }, // 9 & Tail
];
const getTail = () => rope[rope.length - 1];
const visitedTailPositions: Set<string> = new Set([JSON.stringify(getTail())]);

function moveHead(direction: "U" | "D" | "L" | "R") {
  const { x, y } = rope[0];
  if (direction === "D") return { x, y: y - 1 };
  if (direction === "U") return { x, y: y + 1 };
  if (direction === "L") return { x: x - 1, y };
  if (direction === "R") return { x: x + 1, y };
}

moves.map((move) => {
  const [direction, distance] = move.split(" ");

  for (let i = 0; i < parseInt(distance); i++) {
    if (direction === "U" || direction === "D" || direction === "L" || direction === "R") {
      rope[0] = moveHead(direction)!;
    }
    for (let i = 1; i < rope.length; i++) {
      // console.log(`Moveing ${i}`);

      rope[i] = moveTailToHead(rope[i], rope[i - 1]);
    }

    visitedTailPositions.add(JSON.stringify(getTail()));
  }
});

function moveTailToHead(tp: Position, hp: Position): Position {
  // All positions
  // .xdx.
  // x---x
  // d-t-d
  // x---x
  // .xdx.

  const diff = posDiff(tp, hp);
  // console.log('diff', diff);

  // handle "-" and "t" positions
  if (diff.x >= -1 && diff.x <= 1 && diff.y >= -1 && diff.y <= 1) {
    return { x: tp.x, y: tp.y };
  }
  // handle "d" and "x" positions
  // top
  else if (diff.y === +2 && diff.x === -1) return { x: tp.x - 1, y: tp.y + 1 };
  else if (diff.y === +2 && diff.x === 0) return { x: tp.x, y: tp.y + 1 };
  else if (diff.y === +2 && diff.x === +1) return { x: tp.x + 1, y: tp.y + 1 };
  // bottom
  else if (diff.y === -2 && diff.x === -1) return { x: tp.x - 1, y: tp.y - 1 };
  else if (diff.y === -2 && diff.x === 0) return { x: tp.x, y: tp.y - 1 };
  else if (diff.y === -2 && diff.x === +1) return { x: tp.x + 1, y: tp.y - 1 };
  // right
  else if (diff.x === +2 && diff.y === -1) return { x: tp.x + 1, y: tp.y - 1 };
  else if (diff.x === +2 && diff.y === 0) return { x: tp.x + 1, y: tp.y };
  else if (diff.x === +2 && diff.y === +1) return { x: tp.x + 1, y: tp.y + 1 };
  // left
  else if (diff.x === -2 && diff.y === -1) return { x: tp.x - 1, y: tp.y - 1 };
  else if (diff.x === -2 && diff.y === 0) return { x: tp.x - 1, y: tp.y };
  else if (diff.x === -2 && diff.y === +1) return { x: tp.x - 1, y: tp.y + 1 };
  // handle "." positions
  else if (diff.x === 2 && diff.y === 2) return { x: tp.x + 1, y: tp.y + 1 };
  else if (diff.x === 2 && diff.y === -2) return { x: tp.x + 1, y: tp.y - 1 };
  else if (diff.x === -2 && diff.y === -2) return { x: tp.x - 1, y: tp.y - 1 };
  else if (diff.x === -2 && diff.y === 2) return { x: tp.x - 1, y: tp.y + 1 };

  throw new Error(`Head is too far away: diff(x: ${diff.x},y: ${diff.y})`);
}

function posDiff(pStart: Position, pEnd: Position): Position {
  return { x: pEnd.x - pStart.x, y: pEnd.y - pStart.y };
}

// console.log(visited);

console.log({ count: visitedTailPositions.size });
