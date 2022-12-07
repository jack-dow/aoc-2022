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

function calcDirectoryFileSizeTotal(directory: Directory | SingleDirectory | File): number {
  return Object.keys(directory).reduce((acc, key) => {
    const value = directory[key];

    if (typeof value === "string") {
      return acc + parseInt(value);
    } else {
      return acc + calcDirectoryFileSizeTotal(value);
    }
  }, 0);
}

const potentialDirectories: Record<string, number>[] = [];

function checkNestedDirectories(directory: Directory | SingleDirectory | File) {
  Object.keys(directory).forEach((key) => {
    const value = directory[key];
    if (typeof value === "object") {
      if (calcDirectoryFileSizeTotal(value) <= 100000) {
        potentialDirectories.push({ [key]: calcDirectoryFileSizeTotal(value) });
      }
      checkNestedDirectories(value);
    }
  });
}

Object.keys(tree).map((key) => {
  const value = tree[key];

  if (typeof value === "object") {
    if (calcDirectoryFileSizeTotal(value) <= 100000) {
      potentialDirectories.push({ [key]: calcDirectoryFileSizeTotal(value) });
    }
    checkNestedDirectories(value);
  }
});

const total = potentialDirectories.reduce((acc, potentialDirectory) => {
  const key = Object.keys(potentialDirectory)[0];
  const value = potentialDirectory[key];
  return acc + value;
}, 0);

console.log({ total });

// Input:
// $ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k

// Output:
// - / (dir)
//   - a (dir)
//     - e (dir)
//       - i (file, size=584)
//     - f (file, size=29116)
//     - g (file, size=2557)
//     - h.lst (file, size=62596)
//   - b.txt (file, size=14848514)
//   - c.dat (file, size=8504156)
//   - d (dir)
//     - j (file, size=4060174)
//     - d.log (file, size=8033020)
//     - d.ext (file, size=5626152)
//     - k (file, size=7214296)
