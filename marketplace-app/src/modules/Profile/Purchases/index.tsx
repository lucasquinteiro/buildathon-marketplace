"use client";

import { CONTRACT_ADDRESS } from "@/lib/contract";
import { useContract, useContractRead } from "@thirdweb-dev/react";

interface Props {
  address: string;
}

const Purchases: React.FC<Props> = ({ address }) => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data } = useContractRead(contract, "getClientPurchases", [address]);
  console.log(data);

  return (
    <div>
      {/* {data && data.map((purchase: any) => {
        
    }) */}
    </div>
  );
};

export default Purchases;
