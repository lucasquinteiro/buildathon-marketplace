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

interface Props extends Product {
  showStoreSummary?: boolean;
}

const ProductCard: React.FC<Props> = ({
  showStoreSummary = true,
  ...product
}) => {
  const { name, description, price } = product;
  const { handleBuyProduct } = useProduct(product);
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: storeData } = useContractRead(contract, "stores", [
    product.storeID,
  ]);

  return (
    <Card className="w-full md:w-60">
      <Link href="/product">
        <div className="flex flex-col cursor-pointer hover:opacity-80">
          <div className="p-4">
            <div className="relative w-full h-40">
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

          <CardHeader>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{`$${price}`}</p>
          </CardContent>
        </div>
      </Link>
      <CardFooter className="flex flex-col gap-4">
        {showStoreSummary && storeData && <StoreSummary {...storeData} />}
        <BuyButton onBuy={handleBuyProduct} />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
