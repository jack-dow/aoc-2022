export const x = "";

const results = await Deno.readTextFile("./input.txt");
const rucksacks = results.split("\n");

function isLowerCase(str: string) {
  return str === str.toLowerCase();
}

let prioritySum = 0;

let elfGroup: string[] = [];

rucksacks.forEach((rucksack) => {
  elfGroup.push(rucksack);
  if (elfGroup.length === 3) {
    const elf1Upper = elfGroup[0].split("").filter((letter) => !isLowerCase(letter));
    const elf1Lower = elfGroup[0].split("").filter((letter) => isLowerCase(letter));

    const elf2Upper = elfGroup[1].split("").filter((letter) => !isLowerCase(letter));
    const elf2Lower = elfGroup[1].split("").filter((letter) => isLowerCase(letter));

    const elf3Upper = elfGroup[2].split("").filter((letter) => !isLowerCase(letter));
    const elf3Lower = elfGroup[2].split("").filter((letter) => isLowerCase(letter));

    let duplicate = "";

    elf1Upper.forEach((letter) => {
      if (elf2Upper.includes(letter) && elf3Upper.includes(letter)) {
        duplicate = letter;
      }
    });

    elf1Lower.forEach((letter) => {
      if (elf2Lower.includes(letter) && elf3Lower.includes(letter)) {
        duplicate = letter;
      }
    });

    if (duplicate !== "" && !isLowerCase(duplicate)) {
      prioritySum += duplicate.charCodeAt(0) - 38;
    }

    if (duplicate !== "" && isLowerCase(duplicate)) {
      prioritySum += duplicate.charCodeAt(0) - 96;
    }

    elfGroup = [];
  }
});

console.log(prioritySum);
