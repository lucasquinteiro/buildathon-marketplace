"use client";

import { useContract, useContractRead } from "@thirdweb-dev/react";
import Image from "next/image";
import { useMemo } from "react";
import { ethers } from "ethers";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CONTRACT_ADDRESS } from "@/lib/contract";
import Product from "@/types/Product";
import Products from "../Products";
import Store from "@/types/Store";

const Store: React.FC<{ storeID: number }> = ({ storeID }) => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data } = useContractRead(contract, "getCatalog", []);
  const { data: storeData } = useContractRead(contract, "stores", [storeID]);
  const products: Product[] = useMemo(
    () =>
      data?.filter((product: Product) => {
        return product.storeID.eq(ethers.BigNumber.from(storeID));
      }) || [],
    [data, storeID]
  );

  const store = storeData as Store;

  return (
    store && (
      <div className="w-full">
        <div className="relative h-60 w-full">
          <Image
            src={`/stores/${store.bannerPath}`}
            fill
            alt="banner"
            className="relative"
            style={{
              objectFit: "cover",
            }}
          />
          <div className="absolute z-10 -bottom-10 left-10 border-3 rounded-full border-white shadow-md">
            <Avatar className="h-28 w-28">
              <AvatarImage src={`/stores/${store.imagePath}`} />
            </Avatar>
          </div>
        </div>
        <div className="px-12 py-24">
          <Products data={products} showStoreSummary={false} />
        </div>
      </div>
    )
  );
};

export default Store;
