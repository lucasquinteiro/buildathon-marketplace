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

  const DIRECT_FLOW = 0;

  await contractWithStoreOwner.registerProduct(
    product1.price,
    product1.name,
    product1.stock,
    [DIRECT_FLOW]
  );
  await contractWithStoreOwner.registerProduct(
    product2.price,
    product2.name,
    product2.stock,
    [DIRECT_FLOW]
  );

  console.log("catalog read by store owner", await contract.getCatalog());
  console.log(
    "catalog read by customer",
    await contractWithCustomer.getCatalog()
  );
};

export default initializeStore;
