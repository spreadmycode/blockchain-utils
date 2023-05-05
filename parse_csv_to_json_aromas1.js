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
    let keys = [
      "id",
      "category",
      "name",
      "twin",
      "direction",
      "volume",
      "price",
      "topNotes",
      "middleNotes",
      "bottomNotes",
      "desc",
      "settings",
    ];

    let data = [];
    let id = 0;
    createReadStream(csvFilePath)
      .pipe(parse({ delimiter: ",", from_line: 1 }))
      .on("data", function (row) {
        let content = {
          id,
          category: row[0],
          name: row[1],
          twin: row[2],
          direction: row[3].replaceAll(":", ", "),
          volume: row[4],
          price: row[5],
          topNotes: row[6].includes(":") ? row[6].split(":") : row[6],
          middleNotes: row[7].includes(":") ? row[7].split(":") : row[7],
          bottomNotes: row[8].includes(":") ? row[8].split(":") : row[8],
          desc: "",
          settings: [],
        };
        id++;
        data.push(content);
        writeFileSync(`./result/result1.json`, JSON.stringify(data));
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
