export const x = "";

const startTime = performance.now();

const results = await Deno.readTextFile("./test.txt");
const lines = results.split("\n");

console.log({ lines });

const endTime = performance.now();
console.log(`Time taken: ${endTime - startTime}ms`);
