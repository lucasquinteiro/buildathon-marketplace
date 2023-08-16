import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { WebWeaver } from "../../typechain-types";
import Product from "./product";
import { getAccounts } from "../utils/accountsManager";

type StoreData =  {
    name: string;
    logo: string;
    banner: string;
    products: Product[];
}

class Store {
    name: string;
    logo: string;
    banner: string;
    products: Product[];
    owner: HardhatEthersSigner;
    contractReference: WebWeaver;
    registered: boolean;
  
    constructor({
        owner,
        name,
        logo,
        banner,
        products,
        contract
    }: {
        owner: HardhatEthersSigner;
        name: string;
        logo: string;
        banner: string;
        products: Product[];
        contract: WebWeaver;
    }) {
        this.owner = owner;
        this.name = name;
        this.logo = logo;
        this.banner = banner;
        this.products = products;
        this.contractReference = contract;
        this.registered = false;
    }

    async registerStore(): Promise<void> {
        if (this.registered) {
            return;
        }
        await this.contractReference.registerStore(
            this.owner,
            this.name,
            this.logo,
            this.banner
        );
        this.contractReference = this.contractReference.connect(this.owner);
        await this._registerProducts();
    }

    private async _registerProducts(): Promise<void> {
        this.products.forEach((product: Product) => {
            this.contractReference.registerProduct(
                product.price,
                product.name,
                product.imagePath,
                product.description,
                product.stock,
                product.flows
            );        
        });
    }

    public refreshCatalogStock(contract: WebWeaver): void {

    }
}

export default Store;
export { Store, StoreData };