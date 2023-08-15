import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { WebWeaver } from "../../typechain-types";
import Product from "./product";

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
    contractReference: any;
  
    constructor({
        owner,
        name,
        logo,
        banner,
        products,
    }: {
        owner: HardhatEthersSigner;
        name: string;
        logo: string;
        banner: string;
        products: Product[];
    }, contract?: WebWeaver) {
        this.owner = owner;
        this.name = name;
        this.logo = logo;
        this.banner = banner;
        this.products = products;
        if (contract != null) {
            this._registerStore(contract);
            this._registerProducts(contract);
        }
    }

    private _registerStore(contract: WebWeaver): void {
        contract.registerStore(
            this.owner,
            this.name,
            this.logo,
            this.banner
        );
    }

    private _registerProducts(contract: WebWeaver): void {
        contract = contract.connect(this.owner);
        this.products.forEach((product: Product) => {
            contract.registerProduct(
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