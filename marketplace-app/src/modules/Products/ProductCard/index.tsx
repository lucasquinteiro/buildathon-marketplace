"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SellerSummary from "@/modules/Seller/SellerSummary";
import Product from "@/types/Product";
import { ConnectWallet } from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";

const ProductCard: React.FC<Product> = ({
  name,
  description,
  price,
  owner,
}) => {
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
        <SellerSummary {...owner} />
        <ConnectWallet />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
