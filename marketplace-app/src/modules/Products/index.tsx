import Product from "@/types/Product";
import ProductCard from "./ProductCard";
import sampleProducts from "./sampleProducts";

interface Props {
  data: Product[];
}

const Products: React.FC<Props> = ({ data }) => (
  <div className="flex flex-row flex-wrap gap-4">
    {data.map((product) => (
      <ProductCard key={product.id} {...product} />
    ))}
  </div>
);

export default Products;
