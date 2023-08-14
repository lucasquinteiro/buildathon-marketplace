import { ethers } from "hardhat";
import initializeStore from "./utils/initialize_store";
import { deployerAccount } from "./utils/accounts";
import getWallet from "./utils/wallet";

async function main() {
  const deployerWallet = getWallet(deployerAccount);
  const contract = await ethers.deployContract("WebWeaver", deployerWallet);

  await initializeStore(contract);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
