export const x = "";

const results = await Deno.readTextFile("./input.txt");
const lines = results.split("Monkey ").filter(Boolean);

const rounds = 20;

interface Monkey {
  monkeyId: number;
  items: number[];
  operation: "times" | "plus";
  operationValue: number | "old";
  testValue: number;
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
    operationValue: 1,
    testValue: 1,
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
        .map((item) => Number(item));
    }
    if (index === 1) {
      monkey.operation = attribute[23] === "+" ? "plus" : "times";
      monkey.operationValue = attribute.slice(25) === "old" ? "old" : Number(attribute.slice(25));
    }
    if (index === 2) {
      monkey.testValue = Number(attribute.replace("Test: divisible by ", "").trim());
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

for (let i = 0; i < rounds; i++) {
  Object.keys(monkeys).map((monkeyId) => {
    const monkey = monkeys[monkeyId]!;
    monkey.items.map((item) => {
      const operationValue = monkey.operationValue === "old" ? item : monkey.operationValue;
      const worryLevel = Math.floor((monkey.operation === "plus" ? item + operationValue : item * operationValue) / 3);

      // Test if worryLevel is divisible by testValue
      if (worryLevel % monkey.testValue === 0) {
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

console.log({ monkeyBusiness: monkeyBusiness[0] * monkeyBusiness[1] });
