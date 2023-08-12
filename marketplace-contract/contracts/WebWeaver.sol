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

enum Modes {
    DIRECT,
    MODERATED,
    ESCROW
}

struct Product {
    uint productID;
    bytes32 productHash;
    uint storeID;
    uint price;
    uint inStock;
    bool moderatedPurchase;  //TODO CHANGE TO USE MODES

}

struct Client {
    mapping(uint => uint) pointsPerStore;  //TODO CHANGE TO USE ERC20
    uint clientID;
}

enum PurchaseState {
    A_DIRECT_SENT,
    F_DIRECT_RECEIVED,
    F_DIRECT_REJECTED,

    A_ESCROW_SENT,
    ESCROW_CONFIRMED
}

struct Purchase {
    uint clientID;
    uint productID;
    uint storeID;

    uint purchaseID;
    uint transactionPrice;
    Modes mode;
    uint clientInsurance;
    uint storeInsurance;
    PurchaseState state;
    bool closed;
}


contract WebWeaver is Ownable, Transferable {

    uint8 public ESCROW_PURCHASE_STAKE_PERCENTAGE = 30;

    Moderator[] public moderators;
    mapping(address => uint) public moderatorIndexes;

    Store[] public stores;
    mapping(address => uint) storeIndexes;  // stores[storeIndexes[storeOwnerAddress]] TODO revisar forma de addressear un store desde el front, para hacer un get

    Client[] public clients;
    mapping(address => uint) public clientIndexes;

    Product[] public catalog;  //TODO ver de hacer otro mapping con el product hash al product id
    mapping(address => uint256[]) public mappedCatalogs;  // catalog[mappedCatalogs[storeAddress][X]] TODO cambiar a mapping (uint storeID => uint[] productIDs)
    
    Purchase[] public purchases;
    mapping(uint => uint[]) public mappedClientConcretedPurchases;
    mapping(uint => uint[]) public mappedStoreConcretedPurchases;
    mapping(uint => uint[]) public mappedClientOngoingPurchases;
    mapping(uint => uint[]) public mappedStoreOngoingPurchases;

    event DirectPurchaseSent(uint storeID, uint purchaseID, uint productID, bytes32 productHash, uint price);

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

    // Public Views

    function getCatalogRange(uint start, uint end) public view {

    }

    function getStoreRange(uint start, uint end) public view {

    }

    function getStoreCatalogRange(address storeAddress, uint start, uint end) public view {  // TODO revisar si retiro con storeAddress u otra cosa

    }

    function getClientConcretedPurchasesRange(uint ID, uint start, uint end) public view {

    }

    function getStoreConcretedPurchasesRange(uint ID, uint start, uint end) public view {

    }
    
    function getClientOngoingPurchasesRange(uint ID, uint start, uint end) public view {

    }
    
    function getStoreOngoingPurchasesRange(uint ID, uint start, uint end) public view {

    }
    


    // Public Interaction Functions

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
            bytes32 newproductHash = productHash(_productId, storeIndexes[msg.sender]);
            Product memory newProduct = Product({
            productID: _productId,
            productHash: newproductHash,
            storeID: storeIndexes[msg.sender],
            price: _price,
            inStock: _stock,
            moderatedPurchase: _moderatedPurchase
        });
        catalog.push(newProduct);
        mappedCatalogs[msg.sender].push(_productId);
    }

    function updateProduct(uint _productId, uint _price, uint _stock, bool _moderatedPurchase) public {
        Product storage  updateableProduct=catalog[_productId];
        require(updateableProduct.storeID == storeIndexes[msg.sender], "The product you are trying to update does not belong to your store");
        updateableProduct.price = _price;
        updateableProduct.inStock = _stock;
        updateableProduct.moderatedPurchase = _moderatedPurchase;
        
    }

    function productHash(uint256 _productId, uint256 storeID) private pure returns(bytes32) {  // TODO revisar esto para matchear con el hash del web2 back
        return bytes32(keccak256(abi.encodePacked(_productId, storeID)));
    }
    //Yo

    // Direct Flow

    function directPurchase(uint _productID, bytes32 _productHash, uint _storeID) public payable {
        Product memory product = catalog[_productID];
        require(product.productID == _productID, "Product ID missmatch");  //TODO redundant?
        require(product.productHash == _productHash, "Product HASH missmatch");
        require(product.storeID == _storeID, "Store ID missmatch");  // estos chequeos son para evitar confusiones debidas a una mal API call desde el front
        require(msg.value == product.price, "The value sent does not match the product price");
        
        Client storage client = _getClient(msg.sender);
        uint purchaseID = purchases.length;
        Purchase memory purchase = Purchase({
            purchaseID: purchaseID,
            clientID: client.clientID,
            productID: product.productID,
            storeID: product.storeID,
            transactionPrice: product.price,
            mode: Modes.DIRECT,
            clientInsurance: 0,
            storeInsurance: 0,
            state: PurchaseState.A_DIRECT_SENT,
            closed: false
        });
        
        purchases.push(purchase);
        mappedClientOngoingPurchases[client.clientID].push(purchaseID);
        mappedStoreOngoingPurchases[product.storeID].push(purchaseID);
        emit DirectPurchaseSent(product.storeID, purchase.purchaseID, product.productID, product.productHash, product.price);
    }

    

    function automaticEscrowPurchase() public payable {
        //high return fee
    }

    function mediatedEscrowPurchase() public payable {
        //minimum return fee
    }

    // Private Functions

    //Call reputation after confirmation
    function _reputation(bool positive, uint8 _opinion) private {
        require(_opinion <= 5, "The reputation score cannot be higher than 5");
        require(_opinion >= 1, "The reputation score cannot be lower than 1");
        if(positive) {
            stores[storeIndexes[msg.sender]].reputation += _opinion;
        } else {
            stores[storeIndexes[msg.sender]].reputation -= _opinion;
        }
    }

    function _getClient(address clientAddress) private returns (Client storage) {
        if (clientIndexes[clientAddress] == 0 && clientAddress != owner()) {
            // TODO register client
        }
        return clients[clientIndexes[clientAddress]];
    }
}