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

export default Product;
export { Product };