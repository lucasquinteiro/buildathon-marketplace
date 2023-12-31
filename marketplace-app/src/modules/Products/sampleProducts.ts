import Product from "@/types/Product";
import sampleStores from "../Store/sampleStore";

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    description: "This is product 1",
    owner: sampleStores[0],
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    description: "This is product 2",
    owner: sampleStores[0],
  },
  {
    id: 3,
    name: "Product 3",
    price: 300,
    description: "This is product 3",
    owner: sampleStores[0],
  },
  {
    id: 4,
    name: "Product 4",
    price: 400,
    description: "This is product 4",
    owner: sampleStores[0],
  },
  {
    id: 5,
    name: "Product 1",
    price: 100,
    description: "This is product 1",
    owner: sampleStores[1],
  },
  {
    id: 6,
    name: "Product 2",
    price: 200,
    description: "This is product 2",
    owner: sampleStores[1],
  },
  {
    id: 7,
    name: "Product 3",
    price: 300,
    description: "This is product 3",
    owner: sampleStores[1],
  },
  {
    id: 8,
    name: "Product 4",
    price: 400,
    description: "This is product 4",
    owner: sampleStores[1],
  },
];

export default sampleProducts;
