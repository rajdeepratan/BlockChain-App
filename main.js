const SHA2567 = require('crypto-js/sha256');

//block object
class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();

    }
    
    //calcuate the hash for block
    calculateHash(){
        return SHA2567(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}


//blockchain object
class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];

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
        newBlock.hash = newBlock.calculateHash();
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
rdCoin.addBlock(new Block(1, "10/06/2018", { amount: 4 }));
rdCoin.addBlock(new Block(2, "12/06/2018", { amount: 10 }));

// console.log(JSON.stringify(rdCoin, null, 4));

console.log('Blockchain valid? ' + rdCoin.isChainValid());

console.log('Changing a block...');
rdCoin.chain[1].data = { amount: 100 };

console.log('Blockchain valid? ' + rdCoin.isChainValid());
