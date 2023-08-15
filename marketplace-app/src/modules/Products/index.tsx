import Product from "@/types/Product";
import ProductCard from "./ProductCard";

interface Props {
  data: Product[];
  showStoreSummary?: boolean;
}

const Products: React.FC<Props> = ({ data, showStoreSummary = true }) => (
  <div className="bg-gray-700 p-4 mt-8"> {/* Updated background color */}
    <div className="flex justify-between items-center mb-4"> {/* Flex container */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Biggest Sellers</h2> {/* Updated h2 */}
        <p className="text-lg text-white">Shop what`s trending right now!</p> {/* Updated paragraph */}
      </div>
      <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">View All</button> {/* Added button */}
    </div>
    <div className="flex flex-row flex-wrap gap-4">
      {data.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          showStoreSummary={showStoreSummary}
        />
      ))}
    </div>
  </div>
);

export default Products;
