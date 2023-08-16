"use client";

import { useContract, useContractRead } from "@thirdweb-dev/react";
import { Card, CardTitle } from "@/components/ui/card";
import { CONTRACT_ADDRESS } from "@/lib/contract";
import StoreSummary from "@/modules/Store/StoreSummary";
import Purchase from "@/types/Purchase";
import Image from "next/image";

const PurchaseItem: React.FC<Purchase> = ({ productID, storeID }) => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: store } = useContractRead(contract, "stores", [storeID]);
  const { data: product } = useContractRead(contract, "catalog", [productID]);

  return (
    store &&
    product && (
      <Card className="flex items-center gap-4 overflow-hidden">
        <div className="w-fit">
          <div className="relative w-32 h-32 bg-green">
            <Image
              alt={product.name}
              src={`/products/${product.imagePath}`}
              fill
              className="relative p-4"
              style={{
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        <div className="flex justify-between w-full p-8">
          <div className="flex flex-col justify-start gap-2">
            <CardTitle>{product.name}</CardTitle>
            <p className="text-white">{`${product.price} ETH`}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-2xl text-right text-yellow">+100 pts</p>
            <StoreSummary {...store} />
          </div>
        </div>
      </Card>
    )
  );
};

export default PurchaseItem;
