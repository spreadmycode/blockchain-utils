import { readdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
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

const updateFiles = async () => {
  const folderPath = await getInput("Please enter json folder path: ");

  try {
    const files = readdirSync(folderPath);
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const content = readFileSync(filePath);
      const metadata = JSON.parse(content);

      let artistName = "";
      for (let data of metadata.attributes) {
        if (data.trait_type == "Artist") {
          artistName = data.value;
          break;
        }
      }

      metadata.name = metadata.name.replace(
        "GQ3 Issue 001",
        `GQ3 x ${artistName}`
      );
      metadata.description = `${artistName} ${metadata.description}`;

      writeFileSync(`./result/${file}.json`, JSON.stringify(metadata));
    });
  } catch (e) {
    console.log(e);
  }
};

updateFiles();
