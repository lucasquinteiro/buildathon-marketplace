import { ethers } from "hardhat";
import initializeStore from "./utils/initialize_store";
import { CONTRACT_ADDRESS } from "./utils/contract";

async function main() {
  const contract = await ethers.getContractAt("WebWeaver", CONTRACT_ADDRESS);

  await initializeStore(contract);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
