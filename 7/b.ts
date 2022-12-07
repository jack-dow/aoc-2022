export const x = "";

const results = await Deno.readTextFile("./input.txt");
const commandsAndOutputs = results.split("$");

type File = Record<string, string>;
type SingleDirectory = Record<string, File>;
type Directory = {
  [key: string]: SingleDirectory | Directory;
};

type Tree = {
  [key: string]: File | Directory | string;
};

const tree: Tree = {};
let cwd = "";

commandsAndOutputs.forEach((commandsAndOutput) => {
  let output = commandsAndOutput.split("\n");
  const command = output[0].trim();
  output = output.slice(1).filter(Boolean);

  if (command.startsWith("cd")) {
    const directory = command.split(" ")[1];

    if (directory === "..") {
      cwd = cwd.split("/").slice(0, -1).join("/");
    } else if (directory === "/") {
      cwd = "";
    } else {
      cwd = `${cwd}/${directory}`;
    }
  } else if (command.startsWith("ls")) {
    output.forEach((dirOrFile) => {
      if (dirOrFile.startsWith("dir")) {
        const name = dirOrFile.split(" ")[1];

        if (!cwd) {
          tree[name] = {};
          return;
        }
        const directories = cwd.split("/").filter(Boolean);

        directories.reduce((acc, directory, index) => {
          if (index === directories.length - 1) {
            acc[directory] = {
              ...acc[directory],
              [name]: {},
            };
          } else {
            return acc[directory];
          }
        }, tree);
      } else {
        const [size, name] = dirOrFile.split(" ");

        const directories = cwd.split("/").filter(Boolean);

        if (!cwd) {
          tree[name] = size;
          return;
        }

        directories.reduce((acc, directory, index) => {
          if (index === directories.length - 1) {
            acc[directory] = {
              ...acc[directory],
              [name]: size,
            };
          } else {
            return acc[directory];
          }
        }, tree);
      }
    });
  }
});

console.log({ tree });

const TOTAL_DISK_SPACE = 70000000;
const REQUIRED_DISK_SPACE = 30000000;
const currentDiskSpace = calcDirectoryFileSizeTotal(tree);
const requiredDeletion = REQUIRED_DISK_SPACE - (TOTAL_DISK_SPACE - currentDiskSpace);

console.log({ currentDiskSpace, requiredDeletion });

function calcDirectoryFileSizeTotal(directory: Directory | SingleDirectory | File | Tree): number {
  return Object.keys(directory).reduce((acc, key) => {
    const value = directory[key];

    if (typeof value === "string") {
      return acc + parseInt(value);
    } else {
      return acc + calcDirectoryFileSizeTotal(value);
    }
  }, 0);
}

const potentialDirectories: Record<string, number> = {};

function checkNestedDirectories(directory: Directory | SingleDirectory | File | Tree) {
  Object.keys(directory).forEach((key, index) => {
    const value = directory[key];
    if (typeof value === "object") {
      potentialDirectories[key] = calcDirectoryFileSizeTotal(value);
      checkNestedDirectories(value);
    }
  });
}

checkNestedDirectories(tree);

const swapped = Object.entries(potentialDirectories)
  .map(([key, value]) => [value, key])
  .sort((a, b) => a[0] - b[0]);

swapped.every(([value, key]) => {
  if (value >= requiredDeletion) {
    console.log({ value });
    return false;
  }
  return true;
});
