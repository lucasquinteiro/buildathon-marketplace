import Product from "@/types/Product";
import ProductCard from "./ProductCard";

interface Props {
  data: Product[];
  showStoreSummary?: boolean;
}

const Products: React.FC<Props> = ({ data, showStoreSummary = true }) => (
  <div className="w-full mt-10">
    <div className="flex items-center justify-between mb-14">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-semibold text-white">Lo más vendido</h2>
        <p className="font-light text-white">Shop what`s trending right now!</p>
      </div>
      {/* <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
        View All
      </button> */}
    </div>
    <div className="flex flex-row flex-wrap gap-8">
      {data.map((product, index) => (
        <ProductCard
          index={index}
          key={product.productHash}
          {...product}
          showStoreSummary={showStoreSummary}
        />
      ))}
    </div>
  </div>
);

export default Products;
