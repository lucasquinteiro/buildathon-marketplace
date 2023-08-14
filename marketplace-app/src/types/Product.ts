import { BigNumber } from "ethers";

type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
  imagePath?: string;
  // contract props
  inStock: boolean;
  productID: number;
  storeID: BigNumber;
  productHash: string;
};

export default Product;
