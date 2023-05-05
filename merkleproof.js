import { utils } from "ethers";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { createReadStream } from "fs";
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

const getProof = async () => {
  const address = await getInput("Please enter address: ");

  const fileStream = createReadStream("./whitelist.csv");
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let data = [];
  for await (const line of rl) {
    if (line && line.length >= 42) {
      if (line.includes(",")) {
        const splits = line.split(",");
        const address = splits[0];
        const amount = Number(splits[1]);
        data.push({ address, amount });
      }
    }
  }

  const allowed = data.findIndex(
    (item) => item.address.toLowerCase() == address.toLowerCase()
  );
  if (allowed < 0) {
    console.log("Not whitelisted");
    return;
  }

  const elements = data.map((item) =>
    utils.solidityKeccak256(["address", "uint256"], [item.address, item.amount])
  );
  const merkleTree = new MerkleTree(elements, keccak256, { sort: true });
  const proof = merkleTree.getHexProof(elements[allowed]);

  console.log("Merkle Proof", proof);
};

getProof();
