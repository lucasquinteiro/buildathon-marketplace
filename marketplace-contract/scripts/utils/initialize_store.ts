import { WebWeaver } from "../../typechain-types";
import { deployerAccount, accounts } from "./accounts";
import getWallet from "./wallet";

const initializeStore = async (contract: WebWeaver) => {
  const ownerWallet = getWallet(deployerAccount);
  const storeOwnerWallet = getWallet(accounts[0]);
  const customerWallet = getWallet(accounts[1]);

  const contractWithOwner = contract.connect(ownerWallet);
  const contractWithStoreOwner = contract.connect(storeOwnerWallet);
  const contractWithCustomer = contract.connect(customerWallet);

  await contractWithOwner.registerStore(storeOwnerWallet.address);
  console.log("Empty catalog: ", await contract.getCatalog());

  await contractWithStoreOwner.registerProduct(
    10,
    100,
    false,
    "Test product 1"
  );
  await contractWithStoreOwner.registerProduct(
    10,
    100,
    false,
    "Test product 2"
  );

  console.log("catalog read by store owner", await contract.getCatalog());
  console.log(
    "catalog read by customer",
    await contractWithCustomer.getCatalog()
  );
};

export default initializeStore;
