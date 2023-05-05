import { createInterface } from "readline";
import { readFileSync, createReadStream, writeFileSync } from "fs";
import { parse } from "csv-parse";

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

async function parseCSV() {
  const csvFilePath = await getInput("Please enter CSV file path: ");

  try {
    let keys = [];
    const data = readFileSync(csvFilePath, "UTF-8");
    const lines = data.split(/\r?\n/);
    if (lines.length > 0) {
      const headerLine = lines[0];
      const columns = headerLine.split(",");
      for (let column of columns) {
        if (column && column.length > 0) {
          keys.push(column);
        }
      }
    } else {
      console.log("Invalid CSV file");
      return;
    }

    let id = 1;
    createReadStream(csvFilePath)
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {
        let content = {
          token_id: `Variant ${id.toString().padStart(4, "0")}`,
          name: "The JP Effect",
          image: `https://red-large-squirrel-515.mypinata.cloud/ipfs/QmSDSXwLA1i9R1co1q3gxhkPXVHrBouCyA4SiXmAp4Bgbq/${id}.png`,
          description:
            "Welcome to JP's Metaverse presented by King Saladeen, where JP the MoneyBear has dedicated himself to encouraging others to overcome their doubts and find success. Here, the difference-makers and dream chasers have found a place to call home and they are dedicated to supporting each other in achieving their ambitions.",
          about:
            "Welcome to JP's Metaverse presented by King Saladeen, where JP the MoneyBear has dedicated himself to encouraging others to overcome their doubts and find success. Here, the difference-makers and dream chasers have found a place to call home and they are dedicated to supporting each other in achieving their ambitions.",
          external_url: "https://www.thejpeffect.io/",
          attributes: [],
        };
        let attributes = [];
        for (let i = 0; i < keys.length; i++) {
          if (keys[i].includes("Odds")) continue;
          if (row[i]) {
            attributes.push({
              trait_type: keys[i],
              value: row[i],
            });
          }
        }
        content.attributes = attributes;
        writeFileSync(`./result/${id++}`, JSON.stringify(content));
      })
      .on("end", function () {
        console.log("Finished!");
      })
      .on("error", function (error) {
        console.log(error.message);
      });
  } catch (err) {
    console.error(err);
  }
}

parseCSV();
