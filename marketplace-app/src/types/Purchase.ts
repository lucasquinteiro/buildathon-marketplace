import { BigNumber } from "ethers";

type Purchase = {
  clientID: BigNumber;
  productID: BigNumber;
  purchaseID: BigNumber;
  storeID: BigNumber;
};

export default Purchase;
