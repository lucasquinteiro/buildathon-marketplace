"use client";

import { useContractRead, useContract } from "@thirdweb-dev/react";
import { useEffect } from "react";
import { CONTRACT_ADDRESS } from "@/lib/contract";
import Products from "@/modules/Products";
// import Stores from "@/modules/Stores";

export default function Home() {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data, isLoading } = useContractRead(contract, "getCatalog", []);

  const { data: product1 } = useContractRead(contract, "stores", [0]);
  const { data: product2 } = useContractRead(contract, "stores", [1]);
  const { data: product3 } = useContractRead(contract, "stores", [2]);

  console.log(product1, product2, product3);

  useEffect(() => {
    console.log(data);
  }, [data, isLoading]);

  return (
    <main className="flex flex-col items-center justify-between p-20">
      <Products data={data || []} />
      {/* <Stores /> */}
    </main>
  );
}
