const [readline, fs] = [require("readline"), require("fs")];
const { join, extname, basename } = require("path");
const { readdirSync, renameSync } = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("What folder do you want to mass rename?", (folder) => {
  rl.question("What do you want to change?", (change) => {
    rl.question("For what do you want to change it?", (toChange) => {
      console.log(`Changing ${change} to ${toChange} in ${folder}`);

      replaceFilesInFolder(folder, change, toChange);

      rl.close();
    });
  });
});

async function replaceFilesInFolder(folder, change, toChange) {
  for (const oldFile of readdirSync(folder)) {
    const extension = extname(oldFile);
    const name = basename(oldFile, extension);
    let regex = new RegExp(change, "gi");
    if (name.includes(change)) {
      renameSync(
        join(folder, oldFile),
        join(folder, oldFile.replace(regex, toChange) /*  + extension */)
      );
    }
    let stats = fs.statSync(`${folder}\\${oldFile.replace(regex, toChange)}`);

    if (stats.isDirectory()) {
      console.log(`${folderInside} is a folder.`);
      const folderInside = `${folder}\\${oldFile.replace(regex, toChange)}`;
      replaceFilesInFolder(folderInside, change, toChange);
    }
  }
}

rl.on("close", () => {
  console.log("Goodbye 👋");

  // exit the process
  process.exit(0);
});
