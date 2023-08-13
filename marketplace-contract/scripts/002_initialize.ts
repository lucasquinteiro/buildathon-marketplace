import { ethers } from "hardhat";
import initializeStore from "./utils/initialize_store";

async function main() {
  const contract = await ethers.getContractAt(
    "WebWeaver",
    "0xECA3340a08ecB03Df92680AF3DB199db3000Addd"
  );

  await initializeStore(contract);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
