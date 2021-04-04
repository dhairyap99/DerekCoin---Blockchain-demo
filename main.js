const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transaction, previousHash = ''){
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transaction) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor(){
       this.chain = [this.createGenesisBlock()]; 
       this.difficulty = 2;
       this.pendingTransaction = [];
       this.miningReward = 100;
    }

    createGenesisBlock(){ //This is to mark the first block, needs to be created manually
        return new Block("01/01/2021", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransaction(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransaction);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransaction = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];//rewards are reflected when txn from pending txns are executed
    }

    createTransaction(transaction){
        this.pendingTransaction.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){            
            for(const trans of block.transaction){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i=1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if (currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

//Demo time
let derekCoin = new Blockchain();

derekCoin.createTransaction(new Transaction('address1', 'address2', 100));
derekCoin.createTransaction(new Transaction('address2', 'address1', 50)); //address 1 and 2 are public keys of someone's wallet

console.log('\n Starting the miner...');
derekCoin.minePendingTransaction('address3');

console.log('\nBalance of address3 is ', derekCoin.getBalanceOfAddress('address3'));

console.log('\n Starting the miner again...');
derekCoin.minePendingTransaction('address3');

console.log('\nBalance of address3 is ', derekCoin.getBalanceOfAddress('address3'));
