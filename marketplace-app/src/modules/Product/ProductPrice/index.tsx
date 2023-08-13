"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Product from "@/types/Product";
import { ConnectWallet } from "@thirdweb-dev/react";

interface Props extends Product {}

const ProductPrice: React.FC<Props> = ({ price }) => {
  return (
    <Card className="flex flex-col justify-between w-1/4">
      <CardHeader>
        <span>Precio</span>
        <CardTitle>{`$${price}`}</CardTitle>
      </CardHeader>
      <CardFooter className="flex items-center justify-center">
        <ConnectWallet />
      </CardFooter>
    </Card>
  );
};

export default ProductPrice;
