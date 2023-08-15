import { WebWeaver } from "../../typechain-types";
import {
  deployerAccount,
  customerAccount,
  storeAccount,
  storeAccount2
} from "./accounts";
import { product1, product2, product3 } from "./products";
import getWallet from "./wallet";
import fs from "fs";
const yaml = require("js-yaml");


const initializeStore = async (contract: WebWeaver) => {
  const storeOwnerWallet = getWallet(storeAccount);
  const storeOwnerWallet2 = getWallet(storeAccount2);
  const customerWallet = getWallet(customerAccount);
  const deployerWallet = getWallet(deployerAccount);

  const contractWithOwner = contract.connect(deployerWallet);
  const contractWithStoreOwner = contract.connect(storeOwnerWallet);
  const contractWithStoreOwner2 = contract.connect(storeOwnerWallet2);
  const contractWithCustomer = contract.connect(customerWallet);

  await contractWithOwner.registerStore(
    storeOwnerWallet.address,
    "Subway",
    "subway-logo.jpeg",
    "subway-banner.jpeg"
  );
  await contractWithOwner.registerStore(
    storeOwnerWallet2.address,
    "Lucciano's",
    "luccianos-logo.jpeg",
    "luccianos-banner.jpeg"
  );
  console.log("Empty catalog: ", await contract.getCatalog());

  const DIRECT_FLOW = 0;
  await contractWithStoreOwner.registerProduct(
    product1.price,
    product1.name,
    product1.imagePath,
    product1.description,
    product1.stock,
    [DIRECT_FLOW]
  );
  await contractWithStoreOwner.registerProduct(
    product2.price,
    product2.name,
    product2.imagePath,
    product2.description,
    product2.stock,
    [DIRECT_FLOW]
  );

  await contractWithStoreOwner2.registerProduct(
    product3.price,
    product3.name,
    product3.imagePath,
    product3.description,
    product3.stock,
    [DIRECT_FLOW]
  );

  console.log("catalog read by store owner", await contract.getCatalog());
  console.log(
    "catalog read by customer",
    await contractWithCustomer.getCatalog()
  );
};

export default initializeStore;
