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

const ProductCard: React.FC<Product> = (product) => {
  const { name, description, price } = product;
  const { handleBuyProduct } = useProduct(product);

  return (
    <Card className={"w-60 "}>
      <Link href="/product">
        <div className="flex flex-col cursor-pointer hover:opacity-80">
          <div className="p-4 bg-green-300">
            <div className="relative w-full h-20">
              <Image
                src="/lemon-footer.svg"
                fill
                alt="product"
                className="relative"
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
        <StoreSummary {...sampleStores[0]} />
        <BuyButton onBuy={handleBuyProduct} />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
