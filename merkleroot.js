import { utils } from "ethers";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { createReadStream } from "fs";
import { createInterface } from "readline";

const getMerkleRoot = async () => {
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

  const elements = data.map((item) =>
    utils.solidityKeccak256(["address", "uint256"], [item.address, item.amount])
  );
  const merkleTree = new MerkleTree(elements, keccak256, { sort: true });
  const root = merkleTree.getHexRoot();

  console.log("Merkle Root: ", root);
};

getMerkleRoot();
