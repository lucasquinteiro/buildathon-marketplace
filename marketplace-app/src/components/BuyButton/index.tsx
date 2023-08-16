"use client";

import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import IconButton from "../IconButton";

interface Props {
  onBuy?: () => void;
}

const BuyButton: React.FC<Props> = ({ onBuy }) => {
  const address = useAddress();

  return !address ? (
    <ConnectWallet btnTitle="Conectar billetera" />
  ) : (
    <IconButton onClick={onBuy} icon="buy" />
  );
};

export default BuyButton;
