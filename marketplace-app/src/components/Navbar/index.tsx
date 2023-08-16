"use client";

import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Link from "next/link";
import { Button } from "../ui/button";

const Navbar = () => {
  const address = useAddress();
  return (
    <div className="fixed top-0 left-0 z-10 flex items-center justify-between w-full px-20 py-5 bg-background/80">
      <Link href="/">
        <h1 className="text-2xl font-bold text-white">Weaver Market</h1>
      </Link>

      {address ? (
        <div className="flex items-center justify-between gap-10">
          <div className="flex flex-col">
            <p className="text-white">Tus puntos</p>
            <p className="text-yellow">0 pts.</p>
          </div>
          <Link href="/profile">
            <Button>Mi Cuenta</Button>
          </Link>
          <ConnectWallet />
        </div>
      ) : (
        <ConnectWallet />
      )}
    </div>
  );
};

export default Navbar;
