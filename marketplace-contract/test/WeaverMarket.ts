import dotenv from "dotenv";
import { expect } from "chai";
import { ethers } from "hardhat";

import { deployMarket } from "../scripts/deploy_market";
import { populateMarket } from "../scripts/populate_market";
import { WebWeaver } from "../typechain-types";
import { getAccounts } from "../scripts/utils/accountsManager";
import { Store } from "../scripts/entities/store";
import Product from "../scripts/entities/product";


describe("WeaverMarket", function () {
  async function getMarketContract(): Promise<WebWeaver> {
    if (process.env.CONTRACT_ADDRESS == null || process.env.CONTRACT_ADDRESS.length == 0) {
      return await deployMarket();
    } else {
      return await ethers.getContractAt("WebWeaver", process.env.CONTRACT_ADDRESS);
    }
  }

  before(async () => {
    dotenv.config();
  });

  describe("Deployment", function () {
    it("Test basic deployment", async function () {
      const accounts = await getAccounts();
      const contract = await getMarketContract();
      expect(await contract.owner()).to.be.equal(accounts.deployerAccount.address);
      expect(await contract.getAddress()).to.be.equal(process.env.CONTRACT_ADDRESS);
    });

    it("Test populate market", async function () {
      const contract = await getMarketContract();
      const stores: Store[] = await populateMarket(contract);
      stores.forEach(async (store: Store, index: number) => {
        let contractStore = await contract.stores(index);
        expect(store.logo).to.be.equal(contractStore[1]);
        expect(store.banner).to.be.equal(contractStore[2]);
        expect(store.name).to.be.equal(contractStore[3]);
        expect(store.owner).to.be.equal(contractStore[4]);
        let catalog;
        store.products.forEach(async (product: Product, index: number) => {

        })
      });
    });
  });

  /*describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called too soon", async function () {
        const { lock } = await loadFixture(deployOneYearLockFixture);

        await expect(lock.withdraw()).to.be.revertedWith(
          "You can't withdraw yet"
        );
      });

      it("Should revert with the right error if called from another account", async function () {
        const { lock, unlockTime, otherAccount } = await loadFixture(
          deployOneYearLockFixture
        );

        // We can increase the time in Hardhat Network
        await time.increaseTo(unlockTime);

        // We use lock.connect() to send a transaction from another account
        await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
          "You aren't the owner"
        );
      });

      it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        const { lock, unlockTime } = await loadFixture(
          deployOneYearLockFixture
        );

        // Transactions are sent using the first signer by default
        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).not.to.be.reverted;
      });
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        const { lock, unlockTime, lockedAmount } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw())
          .to.emit(lock, "Withdrawal")
          .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the owner", async function () {
        const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).to.changeEtherBalances(
          [owner, lock],
          [lockedAmount, -lockedAmount]
        );
      });
    });
  });*/
});
