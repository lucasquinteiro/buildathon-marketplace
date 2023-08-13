"use client";

import { CONTRACT_ADDRESS } from "@/lib/contract";
import Product from "@/types/Product";
import { useContract, useContractWrite } from "@thirdweb-dev/react";
import { ethers, utils } from "ethers";

const useProduct = (product: Product) => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { mutateAsync, isLoading, error } = useContractWrite(
    contract,
    "directPurchase"
  );

  const handleBuyProduct = async () => {
    try {
      console.log(product.productID, product.productHash, product.storeID);
      const response = await mutateAsync({
        args: [product.productID, product.productHash, product.storeID],
        overrides: {
          //   value: ethers.BigNumber.from(product.price),
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
