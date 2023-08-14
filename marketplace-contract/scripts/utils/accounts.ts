import dotenv from "dotenv";
dotenv.config();

type Account = {
  address: string;
  privateKey: string;
};

const storeAccount = {
  address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  privateKey:
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
};

const storeAccount2 = {
  address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  privateKey:
    "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
};

const customerAccount = {
  address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  privateKey:
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
};

// This are the test accounts generated by hardhat when running `npx hardhat node`
const accounts: Account[] = [storeAccount, storeAccount2, customerAccount];

// This is the account used to deploy the contract to ThirdWeb
const deployerAccount: Account = {
  address: "0x189ff771b5802b22d79ab6cfb9ed0490b61067f6",
  privateKey: process.env.DEPLOYER_PRIVATE_KEY || "",
};

export {
  accounts,
  customerAccount,
  storeAccount,
  storeAccount2,
  deployerAccount,
  Account,
};
