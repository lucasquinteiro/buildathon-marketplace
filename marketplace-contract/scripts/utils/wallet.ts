import { ethers } from "hardhat";
import { Account } from "./accounts";

const getWallet = (account: Account) => {
  const wallet = new ethers.Wallet(account.privateKey, ethers.provider);

  return wallet;
};

export default getWallet;
