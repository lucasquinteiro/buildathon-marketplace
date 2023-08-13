"use client";

import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { Button } from "../ui/button";

interface Props {
  onBuy?: () => void;
}

const BuyButton: React.FC<Props> = ({ onBuy }) => {
  const address = useAddress();

  return !address ? (
    <ConnectWallet btnTitle="Conectar billetera" />
  ) : (
    <Button onClick={onBuy}>Comprar</Button>
  );
};

export default BuyButton;
