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
      expect(stores.length).to.be.greaterThan(0);
      for (const [index, store] of stores.entries()) {
        let contractStore = await contract.stores(index + 1);  // skip over default shop
        expect(store.logo).to.be.equal(contractStore[1]);
        expect(store.banner).to.be.equal(contractStore[2]);
        expect(store.name).to.be.equal(contractStore[3]);
        expect(store.owner.address).to.be.equal(contractStore[4]);
        let catalog = await contract.getStoreCatalog(store.owner.address);
        expect(catalog.length).to.be.equal(store.products.length);
        for (const [index, product] of store.products.entries()) {
          expect(product.name).to.be.equal(catalog[index][1]);
          expect(product.imagePath).to.be.equal(catalog[index][2]);
          expect(product.description).to.be.equal(catalog[index][3]);
          expect(contractStore[0]).to.be.equal(catalog[index][5]);
          expect(product.price).to.be.equal(catalog[index][6]);
          expect(product.stock).to.be.equal(catalog[index][7]);
        }
      }
    });
  });

  describe("Purchases", function () {
    describe("Direct Flow", function () {
      it("Purchase product", async function () {
        const accounts = await getAccounts();
      });
    });
/*
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
