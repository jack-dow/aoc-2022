export const x = "";

const results = await Deno.readTextFile("./input.txt");
const instructions = results.split("\n");

let register = 1;
let cycle = 1;
const cycleRunningLength = 240;

let spritePosition = "###.....................................";
const CRTScreen: Array<Array<"#" | ".">> = [[]];
const newLineCycles = [41, 81, 121, 161, 201];

let waitingInstructions: Array<() => boolean> = [];
let toBeRunInstructions: Array<() => void> = [];

for (let i = 0; i < cycleRunningLength; i++) {
  if (instructions.length > 0 && waitingInstructions.length === 0) {
    const instruction = instructions[0];
    instructions.splice(0, 1);
    const [command, value] = instruction.split(" ");

    switch (command) {
      case "addx":
        waitingInstructions.push(createAddxInstruction(parseInt(value), cycle));
        break;
    }
  }

  if (newLineCycles.includes(cycle)) {
    CRTScreen.push([]);
  }

  let currentSpritePosition = cycle - 1;
  if (cycle > 40) {
    currentSpritePosition -= (CRTScreen.length - 1) * 40;
  }

  CRTScreen[CRTScreen.length - 1].push(spritePosition[currentSpritePosition]);

  // @ts-expect-error - typescript doesn't infer properly
  waitingInstructions = waitingInstructions
    .map((runningInstruction) => {
      const shouldRunAgain = runningInstruction();
      if (shouldRunAgain) {
        return runningInstruction;
      }
    })
    .filter(Boolean);

  toBeRunInstructions.map((instruction) => instruction());
  toBeRunInstructions = [];
  cycle++;
}

function createAddxInstruction(value: number, currentCycle: number) {
  return () => {
    const initialCycle = currentCycle;
    if (cycle - initialCycle === 1) {
      toBeRunInstructions.push(() => {
        register += value;
        spritePosition = spritePosition
          .split("")
          .map((_, index) => (index < register - 1 || index > register + 1 ? "." : "#"))
          .join("");
      });
      return false;
    }
    return true;
  };
}

CRTScreen.map((line) => console.log(line.join("")));
