"use client";

import Image from "next/image";

const Store = () => {
  return (
    <div className="w-full">
      <div className="relative h-60 bg-green-100 w-full">
        <Image
          src="/subway-banner.jpeg"
          fill
          alt="banner"
          className="relative"
          style={{
            objectFit: "cover",
          }}
        />
        <div className="h-40 w-40 rounded-full border-2 border-white bg-green"></div>
      </div>
      <h1>Store</h1>
    </div>
  );
};

export default Store;
