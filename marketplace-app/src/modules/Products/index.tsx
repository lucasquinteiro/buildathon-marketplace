import ProductCard from "./ProductCard";
import sampleProducts from "./sampleProducts";

const Products = () => (
  <div className="flex flex-row flex-wrap justify-start gap-4">
    {sampleProducts.map((product) => (
      <ProductCard key={product.id} {...product} />
    ))}
  </div>
);

export default Products;
