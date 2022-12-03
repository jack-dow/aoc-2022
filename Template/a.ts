export const x = "";

const results = await Deno.readTextFile("./test.txt");
const lines = results.split("\n");
