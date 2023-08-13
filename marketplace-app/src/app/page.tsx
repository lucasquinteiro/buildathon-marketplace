"use client";

import Products from "@/modules/Products";
import { useContractRead, useContract } from "@thirdweb-dev/react";
import { useEffect } from "react";

export default function Home() {
  const { contract } = useContract(
    "0xECA3340a08ecB03Df92680AF3DB199db3000Addd"
  );
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
