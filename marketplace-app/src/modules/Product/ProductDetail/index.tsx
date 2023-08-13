import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import StoreSummary from "@/modules/Store/StoreSummary";
import sampleStores from "@/modules/Store/sampleStore";
import Product from "@/types/Product";
import Image from "next/image";

const ProductDetail: React.FC<Product> = ({ name, description }) => {
  return (
    <Card className="flex flex-row w-3/4 h-72">
      <div className="flex items-center justify-center w-1/4 p-4">
        <div className="relative w-full h-32">
          <Image
            src="/lemon-footer.svg"
            fill
            alt="product"
            className="relative"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between h-full">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <StoreSummary {...sampleStores[0]} />
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductDetail;
