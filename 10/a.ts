export const x = "";

const results = await Deno.readTextFile("./input.txt");
const instructions = results.split("\n");

let register = 1;
let cycle = 1;
const cycleRunningLength = 250;

const testCycles = [20, 60, 100, 140, 180, 220];
let sum = 0;

let waitingInstructions: Array<() => boolean> = [];
let toBeRunInstructions: Array<() => void> = [];

for (let i = 0; i < cycleRunningLength; i++) {
  //   console.log(`Start of ${cycle}`, { register });
  if (instructions.length > 0 && waitingInstructions.length === 0) {
    const instruction = instructions[0];
    instructions.splice(0, 1);
    const [command, value] = instruction.split(" ");

    switch (command) {
      case "noop":
        //   register += parseInt(value);
        break;
      case "addx":
        waitingInstructions.push(createAddxInstruction(parseInt(value), cycle));
        break;
    }
  }

  //   console.log(`During of ${cycle}`, { register });

  if (testCycles.includes(cycle)) {
    sum += cycle * register;
  }

  //   console.log(`End of ${cycle}`, { register });
  //   console.log(" ");

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
  //   console.log("addx added at cycle:", cycle);
  return () => {
    const initialCycle = currentCycle;
    if (cycle - initialCycle === 1) {
      toBeRunInstructions.push(() => {
        // console.log("addx executed");
        register += value;
      });
      return false;
    }
    return true;
  };
}

console.log({ sum });
