"use client";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Link from "next/link";

const Navbar = () => {
  const address = useAddress();

  return (
    <div className="flex items-center justify-between w-full p-4 px-12">
      <Link href="/">
        <h3>WebWeaver</h3>
      </Link>

      <div className="flex flex-row items-center gap-10">
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
