"use client";
import { ConnectWallet } from "@thirdweb-dev/react";

const Navbar = () => (
  <div className="flex items-end justify-end w-full p-4">
    <ConnectWallet />
  </div>
);

export default Navbar;
