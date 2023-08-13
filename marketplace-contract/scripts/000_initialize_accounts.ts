import {
  customerAccount,
  deployerAccount,
  storeAccount,
} from "./utils/accounts";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function init() {
  await helpers.setBalance(customerAccount.address, 1000 * 1e18);
  await helpers.setBalance(storeAccount.address, 1000 * 1e18);
  await helpers.setBalance(deployerAccount.address, 1000 * 1e18);
}

init()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
