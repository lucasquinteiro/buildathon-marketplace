"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { CONTRACT_ADDRESS } from "@/lib/contract";
import StoreSummary from "@/modules/Store/StoreSummary";
import Purchase from "@/types/Purchase";
import { useContract, useContractRead } from "@thirdweb-dev/react";

const PurchaseItem: React.FC<Purchase> = ({ productID, storeID }) => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: store } = useContractRead(contract, "stores", [storeID]);
  const { data: product } = useContractRead(contract, "catalog", [productID]);

  return (
    store &&
    product && (
      <Card className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-4">
          <CardTitle>{product.name}</CardTitle>
          <h3>{`${product.price} ETH`}</h3>
        </div>
        <div>
          <StoreSummary {...store} />
        </div>
      </Card>
    )
  );
};

export default PurchaseItem;
