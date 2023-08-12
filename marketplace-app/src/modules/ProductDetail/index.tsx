import Image from "next/image";

const Product = () => {
  return (
    <div className="flex flex-row w-full gap-4">
      <div className="flex items-center justify-center w-1/2 h-screen border border-gray-300 rounded-md">
        <div className="relative w-full bg-green-300 h-60">
          <Image
            src="/lemon-footer.svg"
            fill
            alt="product"
            className="relative py-5"
          />
        </div>
      </div>
    </div>
  );
};

export default Product;
