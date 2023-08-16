"use client";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Link from "next/link";

const Navbar = () => {
  const address = useAddress();
  return (
    <div className="fixed top-0 flex items-end justify-between w-full p-1 bg-gray-800">
      <div>
        {/* The title of the platform, an h1 in purple */}
        {/* A link that wraps the h1 and goes home */}
        {/* An icon to the left of the h1 */}
        <Link href="/">
          <h1 className="text-5xl text-purple-500">WeaverMarket</h1>
        </Link>
      </div>
      <div className="flex justify-between gap-5 align-center">
        <div className="">
          <p className="text-white"> Your location</p>
          <p className="text-white"> Buenos Aires 🇦🇷</p>
        </div>
        <ConnectWallet />
        {address && (
          <Link href={`/profile`}>
            <h3>Profile</h3>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
