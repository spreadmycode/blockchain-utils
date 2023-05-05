import { readdirSync, rename } from "fs";
import { createInterface } from "readline";
import Jimp from "jimp";

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
  const folderPath = await getInput("Please enter images folder path: ");
  const imageWidth = await getInput("Please enter image width: ");
  const imageHeight = await getInput("Please enter image height: ");

  try {
    const files = readdirSync(folderPath);
    files.forEach(async (file) => {
      const image = await Jimp.read(`${folderPath}/${file}`);
      image
        .resize(Number(imageWidth), Number(imageHeight), function (err) {
          if (err) {
            console.log(err);
            throw err;
          }
        })
        .write(`./result/${file}`);
    });
  } catch (e) {
    console.log(e);
  }
};

renameFiles();
