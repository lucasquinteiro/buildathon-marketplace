import { ethers } from "hardhat";
import { getAccounts } from "./utils/accountsManager";
import { WebWeaver } from "../typechain-types";

const deployMarket = async (): Promise<WebWeaver> => {
    const accounts = await getAccounts();
    const MyContract = await ethers.getContractFactory("WebWeaver");

    const myContract = await MyContract.connect(accounts.deployerAccount).deploy();
    console.log(`Deployer WebWeaver contract at: ${myContract.getAddress()}`);

    return myContract;
};

deployMarket().then(() => {
    console.log("Executed populate_market.ts script");
    process.exitCode = 0;
}).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


export { deployMarket };