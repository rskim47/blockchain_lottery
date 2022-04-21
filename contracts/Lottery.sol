pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

    function Lottery() public {
        // Setting the owner as the message sender 
        manager = msg.sender;
    }

    // Payable key allows sending eth 
    function enter() public payable {
        // Validation
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
    }

    // Randomly pick a winner and send the prize pool
    function pickWinner() public restricted {
        
        uint index = random() % players.length;

        // Transferring Money to the Winner 
        players[index].transfer(this.balance);

        // Resetting the Contract for next lottery round
        players = new address[](0); // 0 sets the initial size

    }

    // Pseudo random number generator
    // Helper Function - view doesn't change any state
    function random() private view returns (uint) {
        return uint(sha3(block.difficulty,now,players));
    }

    // Modifiers 
    modifier restricted() {
        require(msg.sender == manager);
        _; // Pasting other code in the function
    }

    // view - it doesn't change anything 
    function getPlayers() public view returns (address[]) {
        return players;
    }
}