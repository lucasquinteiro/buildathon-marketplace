// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "./Ownable.sol";
import "./Transferable.sol";


struct Moderator {
    address moderatorAddress;
}

struct Store {
    uint storeID;
    address owner;
    uint stake;
    //reputation?
}

enum Mode {
    DIRECT,
    AUTOMATIC_ESCROW,
    MEDIATED
}

struct Product {
    uint productID;
    uint storeID;
    uint price;
    uint inStock;
    Mode[] modes;
}

contract WebWeaver is Ownable, Transferable {

    Moderator[] public moderators;
    mapping(address => uint) public moderatorIndexes;

    Store[] public stores;
    mapping(address => uint) storeIndexes;  // stores[storeIndexes[storeOwnerAddress]]

    Product[] public catalog;
    mapping(address => uint[]) public mappedCatalogs;  // catalog[mappedCatalogs[storeAddress][X]]

    constructor() Ownable() payable {
        moderators.push(Moderator({
            moderatorAddress: msg.sender
        }));
        moderatorIndexes[msg.sender] = moderators.length - 1;
        
        stores.push(Store({
            storeID: stores.length - 1,
            owner: msg.sender,
            stake: msg.value
        }));
        storeIndexes[msg.sender] = stores.length - 1;
    }

    function registerStore(address storeOwner) public onlyOwner returns (uint storeID) {
        require(storeIndexes[storeOwner] == 0, "This address already has a store to its name");
        stores.push(Store({
            storeID: stores.length - 1,
            owner: storeOwner,
            stake: 0
        }));
        storeIndexes[storeOwner] = stores.length - 1;
        return stores.length - 1;
    }

    function changeStoreAddress(address oldAddress, address newAddress) public onlyOwner {
        require(storeIndexes[oldAddress] != 0, "The old address does not have a store to its name");
        require(storeIndexes[newAddress] == 0, "The new address already has a store to its name");
        storeIndexes[newAddress] = storeIndexes[oldAddress];
        delete storeIndexes[oldAddress];
        stores[storeIndexes[newAddress]].owner = newAddress;
    }

    function sendFunds() public payable onlyOwner {
        stores[0].stake += msg.value;
    }

    function withdrawFunds(uint amount) public onlyOwner {
        require(stores[0].stake >= amount, "The amount you are trying to withdraw exceeds the available funds");
        stores[0].stake -= amount;
        _internalTransferFunds(amount, msg.sender);
    }

    function depositStoreStake() public payable {
        require(storeIndexes[msg.sender] != 0, "This address already has a store to its name");
    }

    function withdrawStoreStake(uint amount) public {
        require(storeIndexes[msg.sender] != 0, "This address already has a store to its name");
        require(stores[0].stake >= amount, "The amount you are trying to withdraw exceeds the available funds");
        stores[0].stake -= amount;
        _internalTransferFunds(amount, msg.sender);
    }

    function registerProduct(uint price, uint stock, Mode[] calldata modes) public {
        
    }

    function updateProduct() public {
        require(storeIndexes[msg.sender] != 0, "This address does not have a store to its name");
        Store storage store = stores[storeIndexes[msg.sender]];
        //Delete modes and turn them on one by one
    }

    function automaticEscrowPurchase() public payable {
        //high return fee
    }

    function mediatedEscrowPurchase() public payable {
        //minimum return fee
    }

}