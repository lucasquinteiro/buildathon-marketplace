import { ethers } from "hardhat";
import getWallet from "./utils/wallet";
import { customerAccount } from "./utils/accounts";
import { CONTRACT_ADDRESS } from "./utils/contract";

async function main() {
  const contract = await ethers.getContractAt("WebWeaver", CONTRACT_ADDRESS);

  const customerWallet = getWallet(customerAccount);
  const contractWithCustomer = contract.connect(customerWallet);

  // await contractWithCustomer.directPurchase();
  const catalog = await contractWithCustomer.getCatalog();
  const product = catalog[0];

  const response = await contractWithCustomer.directPurchase(
    product.productID,
    product.productHash,
    product.storeID,
    {
      value: product.price,
    }
  );

  console.log(response);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
