"use client";

import { useContractRead, useContract } from "@thirdweb-dev/react";
import { useEffect } from "react";
import { CONTRACT_ADDRESS } from "@/lib/contract";
import Products from "@/modules/Products";
// import Stores from "@/modules/Stores";

export default function Home() {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data, isLoading } = useContractRead(contract, "getCatalog", []);

  useEffect(() => {
    console.log(data);
  }, [data, isLoading]);

  return (
    <main className="flex flex-col items-center justify-between px-12 py-12 md:px-24">
      <Products data={data || []} />
      {/* <Stores /> */}
    </main>
  );
}
