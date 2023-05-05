import { createInterface } from "readline";
import { writeFileSync } from "fs";
import fetch from "node-fetch";

export const MORALIS_API_KEY =
  "FgYoCWxWqtKtBCjD0KZ090Gf1NagKtpTIeSKymysUcdZEMV6Wi0199VQrWeIjBaR";

export const CHAINIDS = {
  eth: "0x1",
  rinkeby: "0x4",
  avalanche: "0xa86a",
  fujiavalanche: "0xa869",
  goerli: "0x5",
};

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

async function snapshotHolders() {
  const contractAddress = await getInput("Please enter contract address: ");
  const chainId = await getInput(
    "Please enter chain ID (eth, avalanche, etc): "
  );

  let holders = [];
  let amounts = [];
  let cursor = null;
  do {
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2/nft/${contractAddress}/owners?chain=${
        CHAINIDS[chainId]
      }&format=decimal&limit=100&cursor=${cursor ? cursor : ""}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": MORALIS_API_KEY,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      cursor = data.cursor;

      const result = data.result;
      for (let item of result) {
        if (!holders.includes(item.owner_of)) {
          holders.push(item.owner_of);
          amounts.push(item.amount);
        }
      }
    } else {
      console.log("Error occured on fetching data.");
      return;
    }
  } while (cursor != null);

  let content = "";
  for (let i = 0; i < holders.length; i++) {
    const row = holders[i] + "," + amounts[i] + "\r\n";
    content += row;
  }

  writeFileSync(
    `./result/holders_${contractAddress}_${new Date().getTime()}.csv`,
    content
  );
}

snapshotHolders();
