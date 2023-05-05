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
  const newFileName = await getInput("Please enter new file name: ");
  const newFileExtension = await getInput("Please enter new file extension: ");
  const startIndex = await getInput("Please enter start number of suffix: ");

  try {
    const files = readdirSync(folderPath);
    let index = parseInt(startIndex);
    files.forEach((file) => {
      rename(
        `${folderPath}/${file}`,
        `${folderPath}/${newFileName}${index++}.${newFileExtension}`,
        (err) => {
          if (err) console.log(err);
        }
      );
    });
  } catch (e) {
    console.log(e);
  }
};

renameFiles();
