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
    uint reputation;
}


struct Product {
    uint productID;
    bytes32 ProductHASH;
    uint storeID;
    uint price;
    uint inStock;
    bool moderatedPurchase;

}

contract WebWeaver is Ownable, Transferable {

    Moderator[] public moderators;
    mapping(address => uint) public moderatorIndexes;

    Store[] public stores;
    mapping(address => uint) storeIndexes;  // stores[storeIndexes[storeOwnerAddress]]

    Product[] public catalog;
    mapping(address => uint256[]) public mappedCatalogs;  // catalog[mappedCatalogs[storeAddress][X]]
     
    constructor() Ownable() payable {
        moderators.push(Moderator({
            moderatorAddress: msg.sender
        }));
        moderatorIndexes[msg.sender] = moderators.length - 1;
        
        stores.push(Store({
            storeID: stores.length - 1,
            owner: msg.sender,
            stake: msg.value,
            reputation:0
        }));
        storeIndexes[msg.sender] = stores.length - 1;
    }

    function registerStore(address storeOwner) public onlyOwner returns (uint storeID) {
        require(storeIndexes[storeOwner] == 0, "This address already has a store to its name");
        stores.push(Store({
            storeID: stores.length - 1,
            owner: storeOwner,
            stake: 0,
            reputation:0
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
    //Yo
    function registerProduct(uint _price, uint _stock, bool _moderatedPurchase) public {
            require(storeIndexes[msg.sender] != 0, "This address does not have a store to its name");
        //push line 42 and push to 42
        //compare bytes32
            uint _productId= catalog.length;
            bytes32 newProductHash = ProductHash(_productId, storeIndexes[msg.sender]);
            Product memory newProduct = Product({
            productID: _productId,
            ProductHASH: newProductHash,
            storeID: storeIndexes[msg.sender],
            price: _price,
            inStock: _stock,
            moderatedPurchase: _moderatedPurchase
        });
        catalog.push(newProduct);
        mappedCatalogs[msg.sender].push(_productId);
    }

    function updateProduct(uint _productId, uint _price, uint _stock,bool _moderatedPurchase) public {
        Product storage  updateableProduct=catalog[_productId];
        require(updateableProduct.storeID == storeIndexes[msg.sender], "The product you are trying to update does not belong to your store");
        updateableProduct.price = _price;
        updateableProduct.inStock = _stock;
        updateableProduct.moderatedPurchase = _moderatedPurchase;
                
        
    }
    //Yo

    function ProductHash(uint256 _productId, uint256 storeID)private pure  returns(bytes32){
        return bytes32(keccak256(abi.encodePacked(_productId, storeID)));
    }
    function automaticEscrowPurchase() public payable {
        //high return fee
    }

    function mediatedEscrowPurchase() public payable {
        //minimum return fee
    }

//Call reputation after confirmation
function _reputation(bool positive ,uint _opinion) private {
    require(_opinion <= 5, "The reputation score cannot be higher than 5");
    require(_opinion >= 1, "The reputation score cannot be lower than 1");
    if(positive){
        stores[storeIndexes[msg.sender]].reputation += _opinion;
    }
    else{
        stores[storeIndexes[msg.sender]].reputation -= _opinion;
    }
}}