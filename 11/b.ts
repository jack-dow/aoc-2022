export const x = "";

const results = await Deno.readTextFile("./input.txt");
const lines = results.split("Monkey ").filter(Boolean);

const rounds = 1_000_000;

interface Monkey {
  monkeyId: number;
  items: bigint[];
  operation: "times" | "plus";
  operationValue: bigint | "old";
  testValue: bigint;
  testTrueNextMonkey: number;
  testFalseNextMonkey: number;
  timesInspected: number;
}

const monkeys: Record<string, Monkey> = {};

lines.map((line) => {
  const [num, ...attributes] = line.split("\n");
  const monkeyId = parseInt(num.split(":")[0]);

  const monkey: Monkey = {
    monkeyId,
    items: [],
    operation: "times",
    operationValue: 1n,
    testValue: 1n,
    testTrueNextMonkey: 1,
    testFalseNextMonkey: 1,
    timesInspected: 0,
  };

  attributes.map((attribute, index) => {
    if (index === 0) {
      monkey.items = attribute
        .replace("Starting items: ", "")
        .trim()
        .split(", ")
        .map((item) => BigInt(item));
    }
    if (index === 1) {
      monkey.operation = attribute[23] === "+" ? "plus" : "times";
      monkey.operationValue = attribute.slice(25) === "old" ? "old" : BigInt(attribute.slice(25));
    }
    if (index === 2) {
      monkey.testValue = BigInt(attribute.replace("Test: divisible by ", "").trim());
    }
    if (index === 3) {
      monkey.testTrueNextMonkey = Number(attribute.replace("If true: throw to monkey ", "").trim());
    }
    if (index === 4) {
      monkey.testFalseNextMonkey = Number(attribute.replace("If false: throw to monkey ", "").trim());
    }
  });

  monkeys[monkeyId] = monkey;
});

const divisor = Object.keys(monkeys).reduce((acc, monkeyId) => {
  const monkey = monkeys[monkeyId]!;
  return acc * monkey.testValue;
}, 1n);

for (let i = 0; i < rounds; i++) {
  Object.keys(monkeys).map((monkeyId) => {
    const monkey = monkeys[monkeyId]!;
    monkey.items.map((item) => {
      const operationValue = monkey.operationValue === "old" ? item : monkey.operationValue;
      let worryLevel = BigInt(monkey.operation === "plus" ? item + operationValue : item * operationValue);
      worryLevel %= divisor;
      // Test if worryLevel is divisible by testValue
      if (worryLevel % monkey.testValue === 0n) {
        // If true, throw to testTrueNextMonkey
        monkeys[monkey.testTrueNextMonkey].items.push(worryLevel);
      } else {
        // If false, throw to testFalseNextMonkey
        monkeys[monkey.testFalseNextMonkey].items.push(worryLevel);
      }

      monkeys[monkeyId].timesInspected += 1;
    });

    monkey.items = [];
  });
}

const monkeyBusiness = Object.keys(monkeys)
  .map((monkeyId) => monkeys[monkeyId].timesInspected)
  .sort((a, b) => b - a);

console.log({ monkeyBusiness });

console.log({ monkeyBusiness: monkeyBusiness[0] * monkeyBusiness[1] });
