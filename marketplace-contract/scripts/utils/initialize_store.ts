import { WebWeaver } from "../../typechain-types";
import { deployerAccount, customerAccount, storeAccount } from "./accounts";
import { product1, product2 } from "./products";
import getWallet from "./wallet";

const initializeStore = async (contract: WebWeaver) => {
  const storeOwnerWallet = getWallet(storeAccount);
  const customerWallet = getWallet(customerAccount);
  const deployerWallet = getWallet(deployerAccount);

  const contractWithOwner = contract.connect(deployerWallet);
  const contractWithStoreOwner = contract.connect(storeOwnerWallet);
  const contractWithCustomer = contract.connect(customerWallet);

  await contractWithOwner.registerStore(storeOwnerWallet.address);
  console.log("Empty catalog: ", await contract.getCatalog());

  await contractWithStoreOwner.registerProduct(
    product1.price,
    product1.stock,
    product1.moderatedPurchase,
    product1.name
  );
  await contractWithStoreOwner.registerProduct(
    product2.price,
    product2.stock,
    product2.moderatedPurchase,
    product2.name
  );

  console.log("catalog read by store owner", await contract.getCatalog());
  console.log(
    "catalog read by customer",
    await contractWithCustomer.getCatalog()
  );
};

export default initializeStore;
