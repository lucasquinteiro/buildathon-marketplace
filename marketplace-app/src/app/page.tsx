"use client";

import Products from "@/modules/Products";
import { useContractRead, useContract } from "@thirdweb-dev/react";
import { useEffect } from "react";

export default function Home() {
  const { contract } = useContract(process.env.CONTRACT_ADDRESS);
  const { data, isLoading } = useContractRead(contract, "getCatalog", []);

  useEffect(() => {
    console.log(data);
  }, [data, isLoading]);

  return (
    <main className="flex flex-col items-center justify-between">
      <Products data={data || []} />
    </main>
  );
}
