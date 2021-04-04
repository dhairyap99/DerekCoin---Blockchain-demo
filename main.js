const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor(){
       this.chain = [this.createGenesisBlock()]; 
    }

    createGenesisBlock(){ //This is to mark the first block, needs to be created manually
        return new Block(0, "01/01/2021", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash; // Need previous block's hash
        newBlock.hash = newBlock.calculateHash(); // Need to create a hash for new block
        this.chain.push(newBlock);
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
derekCoin.addBlock(new Block(1, "04/04/2021", {amount: 11}));
derekCoin.addBlock(new Block(2, "06/04/2021", {amount: 21}));

console.log('Is blockchain valid?' + derekCoin.isChainValid());

derekCoin.chain[1].data = {amount: 100}; 
derekCoin.chain[1].hash = derekCoin.chain[1].calculateHash();

console.log('Is blockchain valid?' + derekCoin.isChainValid());
//console.log(JSON.stringify(derekCoin, null, 4));