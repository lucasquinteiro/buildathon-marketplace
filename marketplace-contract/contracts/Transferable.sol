// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// This contract is a safeguard to avoid funds being locked in a contract, if the receiver of funds has an error in their receive or fallback function, they can transfer the funds to another account
contract Transferable {

    mapping(address => uint) public weiBalances;

    // To be used by consumers to retrieve locked funds
    function publicTransferFunds(uint amount, address destination) public returns (bool) {
        require(weiBalances[msg.sender] >= amount, "Sender does not have enough funds");
        weiBalances[msg.sender] -= amount;
        address payable payee = payable(destination);
        (bool transferSuccess, ) = payee.call{value: amount}("");
        if (!transferSuccess) {  // if I cant send them the funds, make them available for the payee to perform a transfer
            weiBalances[destination] += amount;
        }
        return transferSuccess;
    }

    // To be used by child contracts to attempt fund transfers
    function _internalTransferFunds(uint amount, address destination) internal returns (bool) {
        weiBalances[msg.sender] += amount;
        return publicTransferFunds(amount, destination);
    }
}