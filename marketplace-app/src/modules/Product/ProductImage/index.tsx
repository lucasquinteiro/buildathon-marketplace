import classnames from "classnames";
import Image from "next/image";

interface Props {
  index?: number;
  imagePath?: string;
  alt: string;
  size: number;
}

const ProductImage: React.FC<Props> = ({ size, index = 0, alt, imagePath }) => {
  const itemIndex = index + 1;
  return (
    <div
      className={classnames(`relative w-full h-[${size}px]`, {
        "bg-orange": itemIndex === 1,
        "bg-green": itemIndex % 2 === 0,
        "bg-blue": itemIndex % 3 === 0,
        "bg-red": itemIndex % 4 === 0,
      })}
    >
      <div className={`relative w-full h-[${size}px]`}>
        <Image
          src={`/products/${imagePath}`}
          fill
          alt={alt}
          className="relative"
          style={{
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
};
export default ProductImage;
