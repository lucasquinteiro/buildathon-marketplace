"use client";

import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Purchases from "./Purchases";

const Profile = () => {
  const address = useAddress();

  return address ? (
    <div className="flex flex-col">
      <h1 className="mb-10 text-4xl font-bold text-white">Tus compras</h1>
      <Purchases address={address} />
    </div>
  ) : null;
};

export default Profile;
