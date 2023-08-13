import sampleProducts from "../Products/sampleProducts";
import ProductDetail from "./ProductDetail";
import ProductPrice from "./ProductPrice";

const PRODUCT = sampleProducts[0];

const Product = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row gap-4">
        <ProductDetail {...PRODUCT} />
        <ProductPrice {...PRODUCT} />
      </div>
    </div>
  );
};

export default Product;
