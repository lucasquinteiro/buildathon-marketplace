import { BigNumber } from "ethers";

type Store = {
  storeID: BigNumber;
  name: string;
  imagePath: string;
  bannerPath: string;
  owner: string;
  reputation: number;
};

export default Store;
