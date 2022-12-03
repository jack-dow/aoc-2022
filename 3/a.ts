export const x = "";

const results = await Deno.readTextFile("./input.txt");
const rucksacks = results.split("\n");

function isLowerCase(str: string) {
  return str === str.toLowerCase();
}

let prioritySum = 0;

rucksacks.forEach((rucksack) => {
  const middle = Math.floor(rucksack.length / 2);
  const firstCompartment = rucksack.slice(0, middle);
  const secondCompartmentLetters = rucksack.slice(middle, rucksack.length).split("");
  const secondCompartmentLettersLowerCase = secondCompartmentLetters.filter((letter) => isLowerCase(letter));
  const secondCompartmentLettersUpperCase = secondCompartmentLetters.filter((letter) => !isLowerCase(letter));

  const lettersFound: string[] = [];

  firstCompartment.split("").forEach((letter) => {
    if (isLowerCase(letter) && secondCompartmentLettersLowerCase.includes(letter) && !lettersFound.includes(letter)) {
      prioritySum += letter.charCodeAt(0) - 96;
      lettersFound.push(letter);
    }
    if (!isLowerCase(letter) && secondCompartmentLettersUpperCase.includes(letter) && !lettersFound.includes(letter)) {
      prioritySum += letter.charCodeAt(0) - 38;
      lettersFound.push(letter);
    }
  });
});

console.log(prioritySum);
