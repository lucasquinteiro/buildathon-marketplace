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
  const DIRECT_FLOW = 0;

  // uint128 _productID, bytes32 _productHash, uint64 _storeID, Flows _purchaseFlow
  // const response = await contractWithCustomer.purchaseProduct(
  //   product.productID,
  //   product.productHash,
  //   product.storeID,
  //   DIRECT_FLOW,
  //   {
  //     value: product.price,
  //   }
  // );

  const purchases = await contractWithCustomer.getClientPurchases(
    customerAccount.address
  );

  console.log(purchases);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
