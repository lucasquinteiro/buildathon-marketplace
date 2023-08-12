import Product from "@/modules/ProductDetail";
import ProductCard from "@/modules/Products/ProductCard";
import sampleProducts from "@/modules/Products/sampleProducts";

const ProductDetailPage = () => {
  return (
    <div className="w-full">
      <ProductCard className="w-1/2" {...sampleProducts[0]} />
    </div>
  );
};

export default ProductDetailPage;
