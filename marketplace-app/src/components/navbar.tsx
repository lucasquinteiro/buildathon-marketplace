"use client";
import { ConnectWallet } from "@thirdweb-dev/react";

const Navbar = () => (
  <div className="fixed top-0 flex items-end justify-between w-full p-1 bg-gray-800">
    <div>
      {/* The title of the platform, an h1 in purple */}
      {/* A link that wraps the h1 and goes home */}
      {/* An icon to the left of the h1 */}
      <h1 className="text-5xl text-purple-500">WeaverMarket</h1>
    </div>
    <div className = "flex justify-between align-center gap-5">
    <div className = "">
      <p className="text-white"> Your location</p>
      <p className="text-white"> Buenos Aires 🇦🇷</p>
    </div>
    <ConnectWallet />
    </div>
  </div>
);

export default Navbar;
