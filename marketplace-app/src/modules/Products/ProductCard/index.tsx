import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Product from "@/types/Product";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";

interface Props extends Product {
  className?: string;
}

const ProductCard: React.FC<Props> = ({
  name,
  description,
  price,
  className,
}) => {
  return (
    <Link href="/product">
      <Card
        className={classNames("cursor-pointer w-60 hover:opacity-80", {
          [String(className)]: !!className,
          "w-full": true,
        })}
      >
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
        <CardFooter>
          <div className="flex flex-col gap-1 overflow-hidden">
            <p className="text-sm">Vendedor</p>
            <span className="overflow-hidden text-xs text-ellipsis">
              0x5124fcC2B3F99F571AD67D075643C743F38f1C34
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
