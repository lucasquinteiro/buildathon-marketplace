"use client";

import { CONTRACT_ADDRESS } from "@/lib/contract";
import Purchase from "@/types/Purchase";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import PurchaseItem from "./Purchase";

interface Props {
  address: string;
}

const Purchases: React.FC<Props> = ({ address }) => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data } = useContractRead(contract, "getClientPurchases", [address]);

  return (
    <div className="flex flex-col gap-4">
      {data &&
        data.map((purchase: Purchase) => {
          return <PurchaseItem key={purchase.purchaseID._hex} {...purchase} />;
        })}
    </div>
  );
};

export default Purchases;
