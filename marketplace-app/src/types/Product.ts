type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;

  // contract props
  inStock: boolean;
  productID: number;
  storeID: number;
  productHash: string;
};

export default Product;
