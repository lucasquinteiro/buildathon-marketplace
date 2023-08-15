import assert from "assert";
import dotenv from "dotenv";
import { ethers } from "hardhat";
import { WebWeaver } from "../typechain-types";
import fs from "fs";
const yaml = require("js-yaml");

import { getAccounts } from "./utils/accountsManager";
import { Store, StoreData } from "./entities/store";

dotenv.config();


const main = async () => {
    const contract: WebWeaver = await ethers.getContractAt("WebWeaver", process.env.CONTRACT_ADDRESS || "");
    await populateMarket(contract);
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

if (process.argv[1].endsWith("populate_market.ts")) {
    main().then(() => {
        console.log("Executed populate_market.ts script");
        process.exitCode = 0;
    }).catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
}

export { populateMarket };