// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "./Ownable.sol";

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
    Mode[] modes;
}

contract WebWeaver is Ownable {

    Moderator[] public moderators;
    mapping(uint => Store) public stores;
    mapping(uint => mapping(uint => Product)) public catalogs;


    function registerStore() public onlyOwner {

    }

    function registerOrUpdateProduct() public {

    }

    function directPurchase() public payable {

    }

    function escrowPurchase() public payable {

    }

    function mediatedEscrowPurchase(address mediator) public payable {

    }

    function depositStoreStake() public {

    }

    function withdrawStoreStake() public {

    }

}