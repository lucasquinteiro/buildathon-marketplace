"use client";

import { CONTRACT_ADDRESS } from "@/lib/contract";
import Product from "@/types/Product";
import { useContract, useContractWrite } from "@thirdweb-dev/react";

const useProduct = (product: Product) => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { mutateAsync: purchaseProduct } = useContractWrite(
    contract,
    "purchaseProduct"
  );

  const handleBuyProduct = async () => {
    try {
      console.log(product.productID, product.productHash, product.storeID);
      const response = await purchaseProduct({
        args: [product.productID, product.productHash, product.storeID, 0],
        overrides: {
          value: product.price,
        },
      });
      console.log(response);
    } catch (err: any) {
      console.error(err);
    }
  };

  return { handleBuyProduct };
};

export default useProduct;
