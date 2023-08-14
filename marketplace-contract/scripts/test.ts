import { ethers } from "hardhat";
import {
  customerAccount,
  deployerAccount,
  storeAccount,
} from "./utils/accounts";
import { CONTRACT_ADDRESS } from "./utils/contract";
import getWallet from "./utils/wallet";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function init() {
  const contract = await ethers.getContractAt("WebWeaver", CONTRACT_ADDRESS);

  const customerWallet = getWallet(customerAccount);
  const contractWithCustomer = contract.connect(customerWallet);
}

init()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
