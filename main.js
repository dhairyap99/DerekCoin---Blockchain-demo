const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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
       this.difficulty = 5;
    }

    createGenesisBlock(){ //This is to mark the first block, needs to be created manually
        return new Block(0, "01/01/2021", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash; // Need previous block's hash
        //newBlock.hash = newBlock.calculateHash(); // Need to create a hash for new block
        newBlock.mineBlock(this.difficulty);
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

console.log('Mining Block 1...');
derekCoin.addBlock(new Block(1, "04/04/2021", {amount: 11}));

console.log('Mining Block 2...');
derekCoin.addBlock(new Block(2, "06/04/2021", {amount: 21}));

// console.log('Is blockchain valid?' + derekCoin.isChainValid());

// derekCoin.chain[1].data = {amount: 100}; 
// derekCoin.chain[1].hash = derekCoin.chain[1].calculateHash();

// console.log('Is blockchain valid?' + derekCoin.isChainValid());
// console.log(JSON.stringify(derekCoin, null, 4));

