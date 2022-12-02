export const x = "";

const results = await Deno.readTextFile("./input.txt");
const lines = results.split("\n");

// Rock beats scissors
// Scissors beats paper
// Paper beats rock

// Play
// Rock = A
// Paper = B
// Scissors = C

// Response
// Rock = X
// Paper = Y
// Scissors = Z

const opponentShapes = {
  A: "rock",
  B: "paper",
  C: "scissors",
};

const myShapes = {
  X: "rock",
  Y: "paper",
  Z: "scissors",
};

const shapeScores = {
  X: 1,
  Y: 2,
  Z: 3,
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
  const myShape = myShapes[choices[1] as keyof typeof myShapes];

  myScore += shapeScores[choices[1] as keyof typeof shapeScores];

  if (opponentShape === "rock") {
    if (myShape === "rock") {
      myScore += gameScores.draw;
    } else if (myShape === "paper") {
      myScore += gameScores.win;
    } else {
      myScore += gameScores.lose;
    }
  }

  if (opponentShape === "paper") {
    if (myShape === "rock") {
      myScore += gameScores.lose;
    } else if (myShape === "paper") {
      myScore += gameScores.draw;
    } else {
      myScore += gameScores.win;
    }
  }

  if (opponentShape === "scissors") {
    if (myShape === "rock") {
      myScore += gameScores.win;
    } else if (myShape === "paper") {
      myScore += gameScores.lose;
    } else {
      myScore += gameScores.draw;
    }
  }
}

console.log(myScore);
