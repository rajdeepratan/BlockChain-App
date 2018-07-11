const SHA2567 = require('crypto-js/sha256');

//transactions object
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

//block object
class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;  //use in mining so that the while loop does not goes in infinite loop

    }
    
    //calcuate the hash for block
    calculateHash(){
        return SHA2567(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
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
        this.difficulty = 2; //setting the mining difficulty level
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    //create first block
    createGenesisBlock(){
        return new Block( "01/01/2018", "Genesis Block", "0");

    }

    //Get latest block in block chain
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    //mining block in block chain
    minePendingTrancations(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    //create Transaction
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    //Show Balance
    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -=trans.amount;
                }
                if(trans.toAddress === address){
                    balance +=trans.amount
                }
            }
        }

        return balance;
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


rdCoin.createTransaction(new Transaction('address1', 'address2', '100'));
rdCoin.createTransaction(new Transaction('address2', 'address1', '50'));

console.log('\n Starting the miner.......');
rdCoin.minePendingTrancations('xaviers-address');

console.log('\nBalance of xavier is ', rdCoin.getBalanceOfAddress('xaviers-address'));

console.log('\n Starting the miner again.......');
rdCoin.minePendingTrancations('xaviers-address');

console.log('\nBalance again of xavier is ', rdCoin.getBalanceOfAddress('xaviers-address'));
