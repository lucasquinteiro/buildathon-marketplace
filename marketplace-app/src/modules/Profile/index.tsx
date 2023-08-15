"use client";

import { useAddress } from "@thirdweb-dev/react";
import Purchases from "./Purchases";

const Profile = () => {
  const address = useAddress();

  return address ? <Purchases address={address} /> : null;
};

export default Profile;
