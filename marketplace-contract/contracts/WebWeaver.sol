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
    uint reputation;
}

enum Modes {
    DIRECT,
    MODERATED_ESCROW,
    AUTOMATIC_ESCROW
}

struct Product {
    uint productID;
    string name;
    bytes32 productHash;
    uint storeID;
    uint price;
    uint inStock;
    bool moderatedPurchase;  // TODO CHANGE TO USE MODES

}

struct Client {
    mapping(uint => uint) pointsPerStore;  // TODO CHANGE TO USE ERC20
    uint clientID;
    address clientAddress;
}

enum PurchaseState {
    A_DIRECT_SENT,
    F_DIRECT_RECEIVED,
    F_DIRECT_REJECTED,

    A_AUTOMATIC_ESCROW_SENT,
    A_AUTOMATIC_ESCROW_CONFIRMED,
    A_AUTOMATIC_ESCROW_APPEAL_REQUEST,
    F_AUTOMATIC_ESCROW_RECEIVED,
    F_AUTOMATIC_ESCROW_CANCELED,
    F_AUTOMATIC_ESCROW_REJECTED,
    // TODO unify a lot of these and unify flow functions, and for specifics, check the purchase mode
    // TODO also unify events, and add mode to event info, and also change mode for flow?
    A_MODERATED_ESCROW_SENT,
    A_MODERATED_ESCROW_CONFIRMED,
    A_MODERATED_ESCROW_APPEAL_REQUEST,
    F_MODERATED_ESCROW_RECEIVED,
    F_MODERATED_ESCROW_CANCELED,
    F_MODERATED_ESCROW_REJECTED
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
}


contract WebWeaver is Ownable, Transferable {

    // TODO add store banning logic

    uint8 public ESCROW_PURCHASE_STAKE_PERCENTAGE = 30;  // TODO ver que esto sea seteable per product

    Moderator[] public moderators;
    mapping(address => uint) public moderatorIndexes;

    Store[] public stores;
    mapping(address => uint) storeIndexes;  // stores[storeIndexes[storeOwnerAddress]] TODO revisar forma de addressear un store desde el front, para hacer un get

    Client[] public clients;
    mapping(address => uint) public clientIndexes;

    Product[] public catalog;  // TODO ver de hacer otro mapping con el product hash al product id
    //mapping(bytes32 => Product)
    mapping(address => uint256[]) public mappedCatalogs;  // catalog[mappedCatalogs[storeAddress][X]] TODO cambiar a mapping (uint storeID => uint[] productIDs)
    
    Purchase[] public purchases;  // TODO research: generate purchase ID by = hash(client, product, clientNonce)
    mapping(uint => uint[]) public mappedClientConcretedPurchases;
    mapping(uint => uint[]) public mappedStoreConcretedPurchases;
    mapping(uint => uint[]) public mappedClientOngoingPurchases;
    mapping(uint => uint[]) public mappedStoreOngoingPurchases;  // TODO aggregate these 4 mappings into one collective static struct?

    event DirectPurchaseSent(uint storeID, uint purchaseID, uint productID, bytes32 productHash, uint price);
    event DirectPurchaseReceived(uint clientID, uint storeID, uint productID, uint purchaseID);
    event DirectPurchaseRejected(uint clientID, uint storeID, uint productID, uint purchaseID);

    event AutomaticEscrowPurchaseSent(uint storeID, uint purchaseID, uint productID, bytes32 productHash, uint price);
    event AutomaticEscrowPurchaseRejected(uint clientID, uint storeID, uint productID, uint purchaseID);
    event AutomaticEscrowPurchaseCanceled(uint clientID, uint storeID, uint productID, uint purchaseID);

    constructor() Ownable() {
        moderators.push(Moderator({
            moderatorAddress: msg.sender
        }));
        moderatorIndexes[msg.sender] = 0;
        
        stores.push(Store({
            storeID: 0,
            owner: msg.sender,
            reputation: 0
        }));
        storeIndexes[msg.sender] = 0;
    }

    // Public Interaction Functions

    function registerStore(address storeOwner) public onlyOwner returns (uint storeID) {
        require(storeIndexes[storeOwner] == 0, "This address already has a store to its name");
        storeID = stores.length;
        stores.push(Store({
            storeID: storeID,
            owner: storeOwner,
            reputation: 0
        }));
        storeIndexes[storeOwner] = storeID;
        return storeID;
    }

    function changeStoreAddress(address oldAddress, address newAddress) public onlyOwner {
        require(storeIndexes[oldAddress] != 0, "The old address does not have a store to its name");
        require(storeIndexes[newAddress] == 0, "The new address already has a store to its name");
        storeIndexes[newAddress] = storeIndexes[oldAddress];
        delete storeIndexes[oldAddress];
        stores[storeIndexes[newAddress]].owner = newAddress;
    }

    function registerProduct(uint _price, uint _stock, bool _moderatedPurchase, string memory _name) public {
        require(storeIndexes[msg.sender] != 0, "This address does not have a store to its name");  // TODO also receive hash to check its not present
        //push line 42 and push to 42
        //compare bytes32
        uint _productId = catalog.length;
        bytes32 newproductHash = productHash(_productId, storeIndexes[msg.sender]);
        Product memory newProduct = Product({
            productID: _productId,
            name: _name,
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

    // Direct Flow

    function directPurchase(uint _productID, bytes32 _productHash, uint _storeID) public payable {
        Product storage product = catalog[_productID];
        require(product.productID == _productID, "Product ID missmatch");  //TODO redundant?
        require(product.productHash == _productHash, "Product HASH missmatch");
        require(product.storeID == _storeID, "Store ID missmatch");  // estos chequeos son para evitar confusiones debidas a una mal API call desde el front
        require(msg.value == product.price, "The value sent does not match the product price");
        
        Client storage client = _getClient(msg.sender);
        uint purchaseID = purchases.length;
        Purchase memory purchase = Purchase({
            clientID: client.clientID,
            productID: product.productID,
            storeID: product.storeID,

            purchaseID: purchaseID,
            transactionPrice: product.price,
            mode: Modes.DIRECT,
            clientInsurance: 0,
            storeInsurance: 0,
            state: PurchaseState.A_DIRECT_SENT
        });
        
        purchases.push(purchase);
        mappedClientOngoingPurchases[client.clientID].push(purchaseID);
        mappedStoreOngoingPurchases[product.storeID].push(purchaseID);
        emit DirectPurchaseSent(product.storeID, purchase.purchaseID, product.productID, product.productHash, product.price);
    }

    function receiveDirectPurchase(uint _purchaseID) public {
        Purchase storage purchase = purchases[_purchaseID];
        require(purchase.state == PurchaseState.A_DIRECT_SENT, "You can only receive a newly sent purchase");
        Store storage store = stores[purchase.storeID];
        require(store.owner == msg.sender, "You cant confirm a purchase that was not issued to you");
        purchase.state = PurchaseState.F_DIRECT_RECEIVED;
        _internalTransferFunds(purchase.transactionPrice, store.owner);
        emit DirectPurchaseReceived(purchase.clientID, purchase.storeID, purchase.productID, purchase.purchaseID);
    }

    function rejectDirectPurchase(uint _purchaseID) public {
        Purchase storage purchase = purchases[_purchaseID];
        require(purchase.state == PurchaseState.A_DIRECT_SENT, "You can only reject a newly sent purchase");
        Store storage store = stores[purchase.storeID];
        require(store.owner == msg.sender, "You cant reject a purchase that was not issued to you");
        Client storage client = clients[purchase.clientID];
        purchase.state = PurchaseState.F_DIRECT_REJECTED;
        _internalTransferFunds(purchase.transactionPrice, client.clientAddress);
        emit DirectPurchaseRejected(purchase.clientID, purchase.storeID, purchase.productID, purchase.purchaseID);
    }

    // Automatic Escrow Flow

    function automaticEscrowPurchase(uint _productID, bytes32 _productHash, uint _storeID) public payable {  // TODO cambiar todos los uint por tipo especifico
        Product storage product = catalog[_productID];
        require(product.productID == _productID, "Product ID missmatch");  //TODO redundant?
        require(product.productHash == _productHash, "Product HASH missmatch");
        require(product.storeID == _storeID, "Store ID missmatch");  // estos chequeos son para evitar confusiones debidas a una mal API call desde el front
        uint256 clientStake = (product.price * ESCROW_PURCHASE_STAKE_PERCENTAGE) / 100;
        require(msg.value == product.price + clientStake, "The value sent does not match the product price plus the stake");

        Client storage client = _getClient(msg.sender);
        uint purchaseID = purchases.length;
        Purchase memory purchase = Purchase({
            purchaseID: purchaseID,
            clientID: client.clientID,
            productID: product.productID,
            storeID: product.storeID,
            transactionPrice: product.price,
            mode: Modes.AUTOMATIC_ESCROW,
            clientInsurance: clientStake,
            storeInsurance: 0,
            state: PurchaseState.A_AUTOMATIC_ESCROW_SENT
        });

        purchases.push(purchase);
        mappedClientOngoingPurchases[client.clientID].push(purchaseID);
        mappedStoreOngoingPurchases[product.storeID].push(purchaseID);
        emit AutomaticEscrowPurchaseSent(product.storeID, purchase.purchaseID, product.productID, product.productHash, product.price);
    }

    function rejectAutomaticEscrowPurchase(uint _purchaseID) public {
        Purchase storage purchase = purchases[_purchaseID];
        require(purchase.state == PurchaseState.A_AUTOMATIC_ESCROW_SENT, "You can only reject a newly sent purchase");
        Store storage store = stores[purchase.storeID];
        require(store.owner == msg.sender, "You cant reject a purchase that was not issued to you");
        Client storage client = clients[purchase.clientID];
        purchase.state = PurchaseState.F_AUTOMATIC_ESCROW_REJECTED;
        _internalTransferFunds(purchase.transactionPrice, client.clientAddress);
        emit AutomaticEscrowPurchaseRejected(purchase.clientID, purchase.storeID, purchase.productID, purchase.purchaseID);
    }

    function clientCancelAutomaticEscrowPurchase(uint _purchaseID) public {  // TODO join this and reject into one function to reduce contract size
        Purchase storage purchase = purchases[_purchaseID];
        require(purchase.state == PurchaseState.A_AUTOMATIC_ESCROW_SENT, "You can only cancel a newly sent purchase");
        Client storage client = clients[purchase.clientID];
        require(client.clientAddress == msg.sender, "You cant cancel a purchase that was not made by you");
        purchase.state = PurchaseState.F_AUTOMATIC_ESCROW_CANCELED;
        _internalTransferFunds(purchase.transactionPrice, client.clientAddress);
        emit AutomaticEscrowPurchaseCanceled(purchase.clientID, purchase.storeID, purchase.productID, purchase.purchaseID);
    }

    function storeConfirmAutomaticEscrowPurchase(uint _purchaseID) public payable {
        
    }

    // Mediated Escrow Flow

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

    function _getClient(address clientAddress) view private returns (Client storage) {
        if (clientIndexes[clientAddress] == 0 && clientAddress != owner()) {
            // TODO register client
        }
        return clients[clientIndexes[clientAddress]];
    }

    function getCatalog() public view returns (Product[] memory) {
        return catalog;
    }
}