export const x = "";

const results = await Deno.readTextFile("./input.txt");
const lines = results.split("\n");

const wins = {
  rock: "paper",
  paper: "scissors",
  scissors: "rock",
};

const losses = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

const opponentShapes = {
  A: "rock",
  B: "paper",
  C: "scissors",
};

const myOutcomes = {
  X: "lose",
  Y: "draw",
  Z: "win",
};

const shapeScores = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

const gameScores = {
  lose: 0,
  draw: 3,
  win: 6,
};

let myScore = 0;

for (const line of lines) {
  const choices = line.split(" ");
  const opponentShape = opponentShapes[choices[0] as keyof typeof opponentShapes];
  const myOutcome = myOutcomes[choices[1] as keyof typeof myOutcomes];

  if (myOutcome === "win") {
    myScore += gameScores.win;
    const myShape = wins[opponentShape as keyof typeof wins];
    myScore += shapeScores[myShape as keyof typeof shapeScores];
  }

  if (myOutcome === "lose") {
    myScore += gameScores.lose;
    const myShape = losses[opponentShape as keyof typeof losses];
    myScore += shapeScores[myShape as keyof typeof shapeScores];
  }

  if (myOutcome === "draw") {
    myScore += gameScores.draw;
    myScore += shapeScores[opponentShape as keyof typeof shapeScores];
  }
}

console.log(myScore);
