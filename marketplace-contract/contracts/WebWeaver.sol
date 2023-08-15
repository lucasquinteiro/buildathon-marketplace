// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "./Ownable.sol";
import "./Transferable.sol";


struct Moderator {
    address moderatorAddress;
}

struct Store {
    uint64 storeID;

    string imagePath;
    string bannerPath;
    string name;

    address owner;
    uint16 reputation;  // TODO revisar concepto
}

enum Flows {
    DIRECT,
    MODERATED_ESCROW,
    AUTOMATIC_ESCROW
}

struct Product {
    uint128 productID;

    string name;
    string imagePath;
    string description;

    bytes32 productHash;
    uint64 storeID;
    uint256 price;  // TODO Ver moneda y unidades
    uint32 inStock;
    Flows[] supportedFlows;
}

struct Client {
    //mapping(uint256 => uint) pointsPerStore;  // TODO CHANGE TO USE ERC20
    uint64 clientID;
    address clientAddress;
}

enum PurchaseState {
    ACTIVE_SENT,

    ACTIVE_CONFIRMED,
    ACTIVE_APPEAL_REQUEST,
    
    FINALIZED_RECEIVED,
    FINALIZED_CANCELED,
    FINALIZED_REJECTED
}

struct Purchase {
    uint64 clientID;
    uint128 productID;
    uint64 storeID;

    uint256 purchaseID;
    uint256 price;  // TODO ver moneda y unidades
    Flows flow;
    uint256 clientInsurance;
    uint256 storeInsurance;
    PurchaseState state;
    uint256 lastUpdatedTimestamp;
}


contract WebWeaver is Ownable, Transferable {

    // TODO add store banning logic

    uint16 CANCELATION_TIMEOUT = 300;
    mapping(Flows => uint8) public flowsEscrowPercentages;

    Moderator[] public moderators;
    mapping(address => uint16) public moderatorIndexes;

    Store[] public stores;
    mapping(address => uint64) storeIndexes;  // stores[storeIndexes[storeOwnerAddress]] TODO revisar forma de addressear un store desde el front, para hacer un get

    Client[] public clients;
    mapping(address => uint64) public clientIndexes;

    Product[] public catalog;  // TODO ver de hacer otro mapping con el product hash al product id
    //mapping(bytes32 => Product)
    mapping(address => uint128[]) public mappedCatalogs;  // catalog[mappedCatalogs[storeAddress][X]] TODO cambiar a mapping (uint256 storeID => uint[] productIDs)
    
    Purchase[] public purchases;  // TODO research: generate purchase ID by = hash(client, product, clientNonce)
    mapping(uint64 => uint256[]) mappedClientPurchases;
    mapping(uint64 => uint256[]) mappedStorePurchases;

    event PurchaseSent(uint64 storeID, Flows purchaseFlow, uint256 purchaseID, uint128 productID, bytes32 productHash, uint256 price);
    
    event PurchaseConfirmed(uint64 clientID, Flows purchaseFlow, uint64 storeID, uint128 productID, uint256 purchaseID);
    event PurchaseAppealed(uint64 clientID, Flows purchaseFlow, uint64 storeID, uint128 productID, uint256 purchaseID);
    
    event PurchaseReceived(uint64 clientID, Flows purchaseFlow, uint64 storeID, uint128 productID, uint256 purchaseID);
    event PurchaseRejected(uint64 clientID, Flows purchaseFlow, uint64 storeID, uint128 productID, uint256 purchaseID);
    event PurchaseCanceled(uint64 clientID, Flows purchaseFlow, uint64 storeID, uint128 productID, uint256 purchaseID);

    constructor() Ownable() {
        flowsEscrowPercentages[Flows.DIRECT] = 0;
        flowsEscrowPercentages[Flows.AUTOMATIC_ESCROW] = 30;
        flowsEscrowPercentages[Flows.MODERATED_ESCROW] = 5;

        moderators.push(Moderator({
            moderatorAddress: msg.sender
        }));
        moderatorIndexes[msg.sender] = 0;
        
        stores.push(Store({
            storeID: 0,
            imagePath: "",
            bannerPath: "",
            name: "DefaultShop",
            owner: msg.sender,
            reputation: 0
        }));
        storeIndexes[msg.sender] = 0;
    }

    // Public Views

    function getCatalog() public view returns (Product[] memory) {  // TODO limit output size
        return catalog;
    }

    function getClientPurchases(address clientAddress) public view returns (Purchase[] memory) {  // TODO limit output size
        uint256[] storage clientPurchasesIndexes = mappedClientPurchases[clientIndexes[clientAddress]];
        Purchase[] memory clientPurchases = new Purchase[](clientPurchasesIndexes.length);
        for (uint i = 0; i < clientPurchasesIndexes.length; i++) {
            clientPurchases[i] = purchases[clientPurchasesIndexes[i]];
        }
        return clientPurchases;
    }

    // Public Interaction Functions

    function registerStore(address storeOwner, string calldata _storeName, string calldata _imagePath, string calldata _bannerPath) public onlyOwner returns (uint64 storeID) {
        require(storeIndexes[storeOwner] == 0, "This address already has a store to its name");
        storeID = uint64(stores.length);
        stores.push(Store({
            storeID: storeID,

            imagePath: _imagePath,
            bannerPath: _bannerPath,
            name: _storeName,

            owner: storeOwner,
            reputation: 0
        }));
        storeIndexes[storeOwner] = storeID;
        return storeID;
    }

    function addModerator(address _moderator) public onlyOwner {
        moderatorIndexes[_moderator] += 1;  // TODO check mod isnt already present
        moderators.push(Moderator({
            moderatorAddress: _moderator
        }));
    }

    function getModeratorIDByAddress(address _moderator) public view returns (uint256) {  // TODO limit output size
        return moderatorIndexes[_moderator];
    }

    function changeStoreAddress(address oldAddress, address newAddress) public onlyOwner {
        require(storeIndexes[oldAddress] != 0, "The old address does not have a store to its name");
        require(storeIndexes[newAddress] == 0, "The new address already has a store to its name");
        storeIndexes[newAddress] = storeIndexes[oldAddress];
        delete storeIndexes[oldAddress];
        stores[storeIndexes[newAddress]].owner = newAddress;
    }

    function registerProduct(uint256 _price, string calldata _name, string calldata _imagePath, string calldata _description, uint32 _stock, Flows[] memory _supportedFlows) public {
        require(storeIndexes[msg.sender] != 0, "This address does not have a store to its name");  // TODO also receive hash to check its not present
        //push line 42 and push to 42
        //compare bytes32
        uint128 _productId = uint128(catalog.length);
        bytes32 newproductHash = productHash(_productId, storeIndexes[msg.sender]);
        Product memory newProduct = Product({
            productID: _productId,
            
            name: _name,
            imagePath: _imagePath,
            description: _description,

            productHash: newproductHash,
            storeID: storeIndexes[msg.sender],
            price: _price,
            inStock: _stock,
            supportedFlows: _supportedFlows
        });
        catalog.push(newProduct);
        mappedCatalogs[msg.sender].push(_productId);
    }

    function updateProduct(uint128 _productId, uint256 _price, uint32 _stock, Flows[] memory _supportedFlows) public {  // TODO check new product members
        Product storage  updateableProduct=catalog[_productId];
        require(updateableProduct.storeID == storeIndexes[msg.sender], "The product you are trying to update does not belong to your store");
        updateableProduct.price = _price;
        updateableProduct.inStock = _stock;
        updateableProduct.supportedFlows = _supportedFlows;
    }

    function productHash(uint128 _productId, uint64 storeID) private pure returns(bytes32) {  // TODO revisar esto para matchear con el hash del web2 back
        return bytes32(keccak256(abi.encodePacked(_productId, storeID)));
    }

    // All Flows

    function purchaseProduct(uint128 _productID, uint64 _storeID, Flows _purchaseFlow) public payable {
        Product storage product = catalog[_productID];
        uint256 clientStake = (product.price * flowsEscrowPercentages[_purchaseFlow]) / 100;
        require(product.productID == _productID, "Product ID missmatch");  //TODO redundant?
        //require(product.productHash == _productHash, "Product HASH missmatch");
        require(product.storeID == _storeID, "Store ID missmatch");  // estos chequeos son para evitar confusiones debidas a una mal API call desde el front
        require(msg.value == product.price + clientStake, "The value sent does not match the product price plus the mode stake");

        Client storage client = _getClient(msg.sender);
        uint256 purchaseID = purchases.length;
        Purchase memory purchase = Purchase({
            clientID: client.clientID,
            productID: product.productID,
            storeID: product.storeID,

            purchaseID: purchaseID,
            price: product.price,
            flow: _purchaseFlow,
            clientInsurance: clientStake,
            storeInsurance: 0,
            state: PurchaseState.ACTIVE_SENT,
            lastUpdatedTimestamp: block.timestamp
        });
        
        purchases.push(purchase);
        mappedClientPurchases[client.clientID].push(purchaseID);
        mappedStorePurchases[product.storeID].push(purchaseID);
        emit PurchaseSent(product.storeID, purchase.flow, purchase.purchaseID, product.productID, product.productHash, product.price);
    }

    function rejectPurchase(uint256 _purchaseID) public {
        Purchase storage purchase = purchases[_purchaseID];
        require(purchase.state == PurchaseState.ACTIVE_SENT, "You can only reject a newly sent purchase");
        Store storage store = stores[purchase.storeID];
        require(store.owner == msg.sender, "You cant reject a purchase that was not issued to you");
        Client storage client = clients[purchase.clientID];
        purchase.state = PurchaseState.FINALIZED_REJECTED;
        purchase.lastUpdatedTimestamp = block.timestamp;
        _internalTransferFunds(purchase.price, client.clientAddress);
        purchase.lastUpdatedTimestamp=block.timestamp;
        emit PurchaseRejected(purchase.clientID, purchase.flow, purchase.storeID, purchase.productID, purchase.purchaseID);
    }

    function clientCancelPurchase(uint256 _purchaseID) public {
        Purchase storage purchase = purchases[_purchaseID];
        require(purchase.state == PurchaseState.ACTIVE_SENT, "You can only cancel a newly sent purchase");
        require(purchase.lastUpdatedTimestamp <= block.timestamp + CANCELATION_TIMEOUT, "You must wait a minimum period before you can cancel");
        Client storage client = clients[purchase.clientID];
        require(client.clientAddress == msg.sender, "You cant cancel a purchase that was not made by you");
        purchase.state = PurchaseState.FINALIZED_CANCELED;
        purchase.lastUpdatedTimestamp = block.timestamp;
        _internalTransferFunds(purchase.price, client.clientAddress);
        // TODO update client reputation?
        purchase.lastUpdatedTimestamp=block.timestamp;
        emit PurchaseCanceled(purchase.clientID, Flows.AUTOMATIC_ESCROW, purchase.storeID, purchase.productID, purchase.purchaseID);
    }

    // Direct Flow

    function receiveDirectPurchase(uint256 _purchaseID) public {
        Purchase storage purchase = purchases[_purchaseID];
        require(purchase.state == PurchaseState.ACTIVE_SENT, "You can only receive a newly sent purchase");
        Store storage store = stores[purchase.storeID];
        require(store.owner == msg.sender, "You cant receive a purchase that was not issued to you");
        purchase.state = PurchaseState.FINALIZED_RECEIVED;
        purchase.lastUpdatedTimestamp = block.timestamp;
        _internalTransferFunds(purchase.price, store.owner);
        purchase.lastUpdatedTimestamp=block.timestamp;
        emit PurchaseReceived(purchase.clientID, Flows.DIRECT, purchase.storeID, purchase.productID, purchase.purchaseID);
    }

    // Escrow Flows

    function storeConfirmEscrowPurchase(uint256 _purchaseID) public payable { //acepta el purchase (va de sent a confirmed)
        Purchase storage purchase = purchases[_purchaseID];
        require(purchase.state == PurchaseState.ACTIVE_SENT, "You can only send a newly sent purchase");
        Store storage store = stores[purchase.storeID];
        require(store.owner == msg.sender, "You cant receive a purchase that was not issued to you");
        require(msg.value == purchase.clientInsurance, "The value sent does not match the store stake");
        purchase.state = PurchaseState.ACTIVE_CONFIRMED;
        purchase.lastUpdatedTimestamp = block.timestamp;
        emit PurchaseConfirmed(purchase.clientID, Flows.AUTOMATIC_ESCROW, purchase.storeID, purchase.productID, purchase.purchaseID);
    }

    function storeCancelsEscrowPurchaseAfterConfirmation(uint256 _purchaseID) public { //va de confirmed a canceled //TODO: Dejar de repetir el codigo de stake reentrancy
        Purchase storage purchase = purchases[_purchaseID];
        require(purchase.state == PurchaseState.ACTIVE_CONFIRMED, "You can only cancel a confirmed purchase in escrow");
        Store storage store = stores[purchase.storeID];
        require(store.owner == msg.sender, "You cant cancel a purchase that was not issued to you");
        Client storage client = clients[purchase.clientID];
        purchase.state = PurchaseState.FINALIZED_CANCELED;
        purchase.lastUpdatedTimestamp = block.timestamp;
        //Hardcoded negative reputation
        _reputation(false, 5,store.owner);
        _internalTransferFunds(purchase.price + purchase.clientInsurance, client.clientAddress);
        _internalTransferFunds(purchase.clientInsurance, store.owner);
        emit PurchaseCanceled(purchase.clientID, Flows.AUTOMATIC_ESCROW, purchase.storeID, purchase.productID, purchase.purchaseID);
    }

    function clientReceivePurchase(uint256 _purchaseID) public { //va de confirmed a received //WARN: SI LLEGAS A PONER ESTO A PROD HACE UNA FUNCION ANTI-REENTRANT
        Purchase storage purchase = purchases[_purchaseID];
        require(purchase.state == PurchaseState.ACTIVE_CONFIRMED, "You can only receive a confirmed purchase in escrow");
        Client storage client = clients[purchase.clientID];
        Store storage store = stores[purchase.storeID];

        require(client.clientAddress == msg.sender, "You cant receive a purchase that was not made by you");
        purchase.lastUpdatedTimestamp=block.timestamp;
        purchase.state = PurchaseState.FINALIZED_RECEIVED;  // Esta es un parche provicional de la vuln, que es declarar el estado antes de transferir los fondos
        _internalTransferFunds(purchase.clientInsurance, client.clientAddress);
        _internalTransferFunds((purchase.price + purchase.clientInsurance), store.owner);
        emit PurchaseReceived(purchase.clientID, Flows.AUTOMATIC_ESCROW, purchase.storeID, purchase.productID, purchase.purchaseID);
    }

    modifier checkflow(uint256 _purchaseID) {
        Purchase storage purchase = purchases[_purchaseID];
        Client storage client = clients[purchase.clientID];
        require(purchase.flow == Flows.MODERATED_ESCROW || purchase.flow == Flows.AUTOMATIC_ESCROW, "You can only appeal a purchase that was made with escrow");
        if (purchase.flow == Flows.MODERATED_ESCROW) {
            require(msg.sender == client.clientAddress || msg.sender == stores[purchase.storeID].owner, "You can only appeal a moderated purchase in which you are involved");
        } else { 
            require(msg.sender == client.clientAddress, "You can only appeal an automatic purchase if you are a client");
        }
        _;
    }
    function appealPurchase(uint256 _purchaseID) public checkflow(_purchaseID) {
        Purchase storage purchase = purchases[_purchaseID];
        purchase.state = PurchaseState.ACTIVE_APPEAL_REQUEST;
        purchase.lastUpdatedTimestamp = block.timestamp;
        emit PurchaseAppealed(purchase.clientID, Flows.AUTOMATIC_ESCROW, purchase.storeID, purchase.productID, purchase.purchaseID);
    }

    modifier whoReceiveResolves(uint256 _purchaseID) {
        Purchase storage purchase = purchases[_purchaseID];
        Client storage client = clients[purchase.clientID];
        require(purchase.flow == Flows.MODERATED_ESCROW || purchase.flow == Flows.AUTOMATIC_ESCROW, "You can only appeal a purchase that was made with escrow");
        if (purchase.flow == Flows.MODERATED_ESCROW) {
            require(moderatorIndexes[msg.sender] > 0 || msg.sender == owner(), "You can only resolve an apeal to a moderated purchase if you are a moderator");
        } else {
            require(msg.sender == client.clientAddress, "You can only ReceiveResolve an automatic purchase if you are the client");
        }
        _;
    }
    function ReceivedResolve(uint256 _purchaseID) public whoReceiveResolves(_purchaseID) {
        Purchase storage purchase = purchases[_purchaseID];
        require(purchase.state == PurchaseState.ACTIVE_APPEAL_REQUEST, "You can only resolve an appealed purchase");
        Client storage client = clients[purchase.clientID];
        Store storage store = stores[purchase.storeID];
        purchase.state = PurchaseState.FINALIZED_RECEIVED;
        purchase.lastUpdatedTimestamp = block.timestamp;
        _internalTransferFunds(purchase.clientInsurance, client.clientAddress);
        _internalTransferFunds((purchase.price + purchase.clientInsurance), store.owner);
        emit PurchaseReceived(purchase.clientID, Flows.AUTOMATIC_ESCROW, purchase.storeID, purchase.productID, purchase.purchaseID);
    }

    modifier whoCancelResolves(uint256 _purchaseID) {
        Purchase storage purchase = purchases[_purchaseID];
        Client storage client = clients[purchase.clientID];
        require(purchase.flow == Flows.MODERATED_ESCROW || purchase.flow == Flows.AUTOMATIC_ESCROW, "You can only appeal a purchase that was made with escrow");
        if (purchase.flow==Flows.MODERATED_ESCROW){
            require(moderatorIndexes[msg.sender] > 0 || msg.sender == owner(), "You can only resolve an apeal to a moderated purchase if you are a moderator");
        } else {
            require(msg.sender == stores[purchase.storeID].owner, "You can only CancelResolve an automatic purchase if you are the store owner");
        }
        _;
    }
    function calceledResolve(uint256 _purchaseID)  public whoCancelResolves(_purchaseID) {
        Purchase storage purchase = purchases[_purchaseID];
        require(purchase.state == PurchaseState.ACTIVE_APPEAL_REQUEST, "You can only resolve an appealed purchase");
        Store storage store = stores[purchase.storeID];
        Client storage client = clients[purchase.clientID];
        purchase.state = PurchaseState.FINALIZED_CANCELED;
        purchase.lastUpdatedTimestamp = block.timestamp;
        _internalTransferFunds(purchase.clientInsurance, store.owner);
        _internalTransferFunds((purchase.price + purchase.clientInsurance), client.clientAddress);
        emit PurchaseCanceled(purchase.clientID, Flows.AUTOMATIC_ESCROW, purchase.storeID, purchase.productID, purchase.purchaseID);
    }
    
    // Automatic Escrow Flow

    //function client apeal va de confirmed a apeal request
    //function store resolve cancel va de apeal a canceled
    //function client resolve receive va de apeal a received

    // Moderated Escrow Flow

    //function store OR client apeal va de confirmed a apeal request
    //function moderator resolve cancel va de apeal a canceled
    //function moderator resolve receive va de apeal a received
    
    // Private Functions

    //Call reputation after confirmation
    function _reputation(bool positive, uint8 _opinion, address _storeOwner) private {
        require(_opinion <= 5, "The reputation score cannot be higher than 5");
        require(_opinion >= 1, "The reputation score cannot be lower than 1");
        if (positive) {
            stores[storeIndexes[_storeOwner]].reputation += _opinion;
        } else {
            stores[storeIndexes[_storeOwner]].reputation -= _opinion;
        }
    }

    function _getClient(address clientAddress) private returns (Client storage) {
        if (clientIndexes[clientAddress] == 0 && clientAddress != owner()) {
            uint64 clientID = uint64(clients.length);
            Client memory client = Client({
                clientAddress: clientAddress,
                clientID: clientID
            });
            clients.push(client);
            clientIndexes[clientAddress] = clientID;
        }
        return clients[clientIndexes[clientAddress]];
    }
}