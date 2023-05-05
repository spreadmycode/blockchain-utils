import { readdirSync, rename } from "fs";
import { createInterface } from "readline";

async function getInput(message) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(`${message} `, function (value) {
      rl.close();
      resolve(value);
    });
  });
}

const renameFiles = async () => {
  const folderPath = await getInput("Please enter folder path: ");

  try {
    const files = readdirSync(folderPath);
    files.forEach((file) => {
      let newFileName = file;
      if (newFileName.includes(".")) {
        newFileName = newFileName.split(".")[0];
      }
      rename(`${folderPath}/${file}`, `${folderPath}/${newFileName}`, (err) => {
        if (err) console.log(err);
      });
    });
  } catch (e) {
    console.log(e);
  }
};

renameFiles();
