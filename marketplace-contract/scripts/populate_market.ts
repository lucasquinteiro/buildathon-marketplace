import assert from "assert";
import dotenv from "dotenv";
import { ethers } from "hardhat";
import { WebWeaver } from "../typechain-types";
import fs from "fs";
const yaml = require("js-yaml");

import { getAccounts } from "./utils/accountsManager";
import { Store, StoreData } from "./entities/store";
import { deployMarket } from "./deploy_market";

dotenv.config();


const main = async () => {
    if (process.argv.length > 5) {
        console.error("You can only send one parameter [Contract address]");
    }

    var contractAddress: string = "";
    if (process.argv.length == 5) {
        contractAddress = process.argv[5];
    } else {
        contractAddress = process.env.CONTRACT_ADDRESS || "" ;
    }

    var contract: WebWeaver;
    if (contractAddress == "") {
        contract = await deployMarket();
    } else {
        contract = await ethers.getContractAt("WebWeaver", contractAddress);
    }
    

    //aca me fijo si ya hay contrato deployado en el env.CONTRACT_ADDRESS, y sino, lo deployo
    //llamo a populate aca
};

const populateMarket = async (contract: WebWeaver) => {
    const signers = await ethers.getSigners();
    const accounts = await getAccounts();
    contract = contract.connect(accounts.deployerAccount);
    var stores: Store[] = [];
    var storesData: StoreData[] = yaml.load(fs.readFileSync('./scripts/data/stores.yaml', 'utf-8')).stores;
    assert(storesData.length <= 10, "You cant have more than 10 stores for the test environment");
    storesData.forEach(async (storeData: StoreData, index: number) => {
        stores.push(new Store({
            owner: signers[index + 2],  // First 2 are reserved for deployer and customer
            name: storeData.name,
            logo: storeData.logo,
            banner: storeData.banner,
            products: storeData.products
        }));
    });
    return stores;
};

main().then(() => {
    console.log("Executed populate_market.ts script");
    process.exitCode = 0;
}).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


export { populateMarket };