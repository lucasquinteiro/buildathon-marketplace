import assert from "assert";
import { ethers } from "hardhat";
import { WebWeaver } from "../../typechain-types";
import { setBalance } from "@nomicfoundation/hardhat-network-helpers";
import fs from "fs";
const yaml = require("js-yaml");


const populateMarket = async (contract: WebWeaver) => {
    const signers = await ethers.getSigners();
    var stores: Store[] = yaml.load(fs.readFileSync('./scripts/data/stores.yaml', 'utf-8')).stores;
    assert(stores.length <= 10, "You cant have more than 10 stores for the test environment");
    stores.forEach((store: Store, index: number) => {
        store.owner = signers[index + 2];  // First 2 are reserved for deployer and customer
    });

    return stores;
};

class Store {
    name: string;
    logo: string;
    banner: string;
    products: Product[];
    owner: any;
    contractReference: any;
  
    constructor({
        name,
        logo,
        banner,
        products,
    }: {
        name: string;
        logo: string;
        banner: string;
        products: Product[];
    }) {
        this.name = name;
        this.logo = logo;
        this.banner = banner;
        this.products = products;
    }
}
  
class Product {
    price: number;
    stock: number;
    name: string;
    imagePath: string;
    description: string;
    flows: number[];
  
    constructor({
        price,
        stock,
        name,
        imagePath,
        description,
        flows,
    }: {
        price: number;
        stock: number;
        name: string;
        imagePath: string;
        description: string;
        flows: number[];
    }) {
        this.price = price;
        this.stock = stock;
        this.name = name;
        this.imagePath = imagePath;
        this.description = description;
        this.flows = flows;
    }
}

export {
    Product,
    Store,
    populate
};