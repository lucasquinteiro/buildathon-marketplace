import dotenv from "dotenv";
import { ethers } from "hardhat";
import { setBalance } from "@nomicfoundation/hardhat-network-helpers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Wallet } from "ethers";

dotenv.config();

type AccountsManager = {
    clientAccount: HardhatEthersSigner;
    deployerAccount: HardhatEthersSigner | Wallet;
    extraAccounts: HardhatEthersSigner[];
};

const getAccounts = async (): Promise<AccountsManager> => {
    const signers = await ethers.getSigners();
    var deployerAccountSigner;
    if (process.env.DEPLOYER_PRIVATE_KEY != null && process.env.DEPLOYER_ADDRESS != null) {
        deployerAccountSigner = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, ethers.provider);
        if ((await ethers.provider.getBalance(process.env.DEPLOYER_ADDRESS) < 1e19)) {
            setBalance(process.env.DEPLOYER_ADDRESS, 1e22);
        }
    } else {
        deployerAccountSigner = signers[0];
    }
    var accountsManager: AccountsManager = {
        clientAccount: signers[1],
        deployerAccount: deployerAccountSigner,
        extraAccounts: signers.slice(2)
    };
    return accountsManager;
}

export { getAccounts, AccountsManager };