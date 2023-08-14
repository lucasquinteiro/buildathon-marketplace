import Product from "@/types/Product";
import ProductCard from "./ProductCard";

interface Props {
  data: Product[];
  showStoreSummary?: boolean;
}

const Products: React.FC<Props> = ({ data, showStoreSummary = true }) => (
  <div className="flex flex-row flex-wrap gap-4">
    {data.map((product) => (
      <ProductCard
        key={product.id}
        {...product}
        showStoreSummary={showStoreSummary}
      />
    ))}
  </div>
);

export default Products;
