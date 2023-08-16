"use client";
import BuyButton from "@/components/BuyButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StoreSummary from "@/modules/Store/StoreSummary";
import sampleStores from "@/modules/Store/sampleStore";
import Product from "@/types/Product";
import Image from "next/image";
import Link from "next/link";
import useProduct from "../useProduct";
import { CONTRACT_ADDRESS } from "@/lib/contract";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { cardColors, getRandomItem } from "@/lib/utils";
import { useMemo } from "react";
import classnames from "classnames";
import IconButton from "@/components/IconButton";

interface Props extends Product {
  showStoreSummary?: boolean;
  index: number;
}

const ProductCard: React.FC<Props> = ({
  showStoreSummary = true,
  index,
  ...product
}) => {
  const { name, price } = product;
  const { handleBuyProduct } = useProduct(product);
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: storeData } = useContractRead(contract, "stores", [
    product.storeID,
  ]);

  return (
    <Card className="relative w-full md:w-[300px] overflow-hidden border-none">
      <div className="absolute z-10 top-2 right-2">
        <BuyButton />
      </div>
      <Link href="/product">
        <div className="flex flex-col cursor-pointer hover:opacity-80">
          <div
            className={classnames(`relative w-full h-[300px]`, {
              "bg-orange": index === 0,
              "bg-green": index === 1,
              "bg-blue": index === 2,
              "bg-red": index === 3,
            })}
          >
            <div className={`relative w-full h-[300px]`}>
              <Image
                src={`/products/${product.imagePath}`}
                fill
                alt="product"
                className="relative"
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
          </div>

          <CardContent className="flex flex-col gap-4">
            <CardTitle>{name}</CardTitle>
            {showStoreSummary && storeData && <StoreSummary {...storeData} />}
          </CardContent>
          <CardFooter className="flex justify-between w-full gap-6">
            <div className="flex flex-col items-start justify-start gap-2">
              <p className="text-xs text-muted">Precio</p>
              <div className="flex items-end gap-2">
                <p className="text-white">{`${price} ETH`}</p>
                <p className="text-xs text-green"> -15%</p>
              </div>
            </div>
            <div className="flex flex-col items-end justify-start gap-2">
              <p className="text-xs text-muted">Acumula Puntos</p>
              <p className="text-xl text-right text-yellow">100 pts</p>
            </div>
          </CardFooter>
        </div>
      </Link>

      {/* <CardFooter className="flex flex-col gap-4">
        {showStoreSummary && storeData && <StoreSummary {...storeData} />}
        <BuyButton onBuy={handleBuyProduct} />
      </CardFooter> */}
    </Card>
  );
};

export default ProductCard;
