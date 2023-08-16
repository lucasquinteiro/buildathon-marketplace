import { ethers } from "hardhat";
import { getAccounts } from "./utils/accountsManager";
import { WebWeaver } from "../typechain-types";

const deployMarket = async (): Promise<WebWeaver> => {
    const accounts = await getAccounts();
    const MyContract = await ethers.getContractFactory("WebWeaver");

    const myContract = await MyContract.connect(accounts.deployerAccount).deploy();
    //console.log(`Deployed WebWeaver contract at: ${await myContract.getAddress()}`);
    process.env.CONTRACT_ADDRESS = await myContract.getAddress();

    return myContract;
};
if (process.argv[1].endsWith("deploy_market.ts")) {
    deployMarket().then(() => {
        console.log("Executed deploy_market.ts script");
        process.exitCode = 0;
    }).catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
}

export { deployMarket };