type Product = {
  price: number;
  stock: number;
  name: string;
  imagePath: string;
  description: string;
  flows: number[];
};

const product1: Product = {
  price: 10,
  stock: 100,
  name: "Turkey Combo",
  imagePath: "product1.jpeg",
  description: "Footlong sub with turkey, lettuce, tomato, and mayo.",
  flows: [0],
};

const product2: Product = {
  price: 20,
  stock: 100,
  name: "Teriyaki",
  imagePath: "product2.webp",
  description: "Teriyaki footlong sub with turkey, lettuce, tomato, and mayo.",
  flows: [0],
};

const product3: Product = {
  price: 30,
  stock: 100,
  name: "Paleta Minion",
  imagePath: "product3.png",
  description: "Paleta de frutilla.",
  flows: [0],
};

const products = [product1, product2, product3];

export { product1, product2, products, product3 };
