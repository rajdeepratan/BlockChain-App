const SHA2567 = require('crypto-js/sha256');

//block object
class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;  //use in mining so that the while loop does not goes in infinite loop

    }
    
    //calcuate the hash for block
    calculateHash(){
        return SHA2567(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    //Blockchain mining
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();

        }
        console.log("Block mined: " + this.hash);
    }
}


//blockchain object
class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4; //setting the mining difficulty level
    }

    //create first block
    createGenesisBlock(){
        return new Block(0, "01/01/2018", "Genesis Block", "0");

    }

    //Get latest block in block chain
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    //create a new block in block chain
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    
    }

    //validation of blocks in block chain
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

//create rdCoin
let rdCoin = new Blockchain();

console.log("Mining block 1...");
rdCoin.addBlock(new Block(1, "10/06/2018", { amount: 4 }));
console.log(JSON.stringify(rdCoin, null, 4));

console.log("Mining block 2...");
rdCoin.addBlock(new Block(2, "12/06/2018", { amount: 10 }));
console.log(JSON.stringify(rdCoin, null, 4));