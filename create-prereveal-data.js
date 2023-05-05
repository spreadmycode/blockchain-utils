import { createInterface } from "readline";
import { readFileSync, createReadStream, writeFileSync, readdirSync } from "fs";
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
  // const csvFilePath = await getInput("Please enter CSV file path: ");
  const folderPath = await getInput("Please enter folder path: ");

  try {
    // let keys = [];
    const files = readdirSync(folderPath);
    // let index = parseInt(startIndex);
    // const data = readFileSync(csvFilePath, "UTF-8");
    // cnost lines = data.split(/\r?\n/);

    let id = 1;
    for (let _ of files) {
      let content = {
        // token_id: `Variant ${id.toString().padStart(4, "0")}`,
        name: `Badam Bomb Squad #${id.toString()}`,
        description:
          "Little has been known about Badam Bomb until now. Badam has a frown with one gold tooth. He appears to be the opposite of Adam Bomb -- too cool, unfriendly and unapproachable. But, what if he wasn't? What if he wasn't bad, evil, or nefarious? What if he was just misunderstood? Explore Badam Bomb Squad, a collection of 5,000 NFTs that tell a story of how society often misreads and misconstrues one another through a series of traits and characteristics. Sometimes the only difference between you and your enemy is the way your ideas are dressed.",
        image: `https://thehundreds-abs.mypinata.cloud/ipfs/QmcJkg9Tr5zPgjrggMEtXC6zT8BU3zgpFvXAB5w2WvTMDA/prereveal.jpeg`,

        external_url: "https://www.adambombsquad.com/",
        edition: id,
        attributes: [],
      };
      let attributes = [];

      content.attributes = attributes;
      writeFileSync(`./result/${id++}`, JSON.stringify(content));
    }
  } catch (err) {
    console.error(err);
  }
}

parseCSV();
