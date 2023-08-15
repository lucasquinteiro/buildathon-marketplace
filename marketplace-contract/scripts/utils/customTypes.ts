type Product = {
    price: number;
    stock: number;
    name: string;
    imagePath: string;
    description: string;
    flows: number[];
};
  
type Store = {
    name: string;
    logo: string;
    banner: string;
    products: Product[];  
}

export {
    Product,
    Store
};