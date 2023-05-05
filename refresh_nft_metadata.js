import readline from "readline";
import fetch from "node-fetch";

async function getInput(message) {
  const rl = readline.createInterface({
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

async function refreshMetadata() {
  const contractAddress = await getInput("Please enter contract address: ");
  const supply = await getInput("Please enter total supply: ");
  const startIndex = await getInput("Please enter start token ID: ");

  for (
    let tokenId = parseInt(startIndex);
    tokenId < parseInt(startIndex) + supply;
    tokenId++
  ) {
    const url = `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}/?force_update=true`;
    const response = await fetch(url);
    if (response.ok) {
      console.log(`Done with ${tokenId}`);
    } else {
      console.log(await response.text());
      return;
    }
  }
}

refreshMetadata();
