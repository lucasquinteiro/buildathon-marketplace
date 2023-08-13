import { ethers } from "hardhat";
import initializeStore from "./utils/initialize_store";
import {
  customerAccount,
  storeAccount,
  deployerAccount,
} from "./utils/accounts";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const contract = await ethers.deployContract("WebWeaver");
  await contract.waitForDeployment();

  await helpers.setBalance(customerAccount.address, 1000 * 1e18);
  await helpers.setBalance(storeAccount.address, 1000 * 1e18);
  await helpers.setBalance(deployerAccount.address, 1000 * 1e18);

  await initializeStore(contract);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
