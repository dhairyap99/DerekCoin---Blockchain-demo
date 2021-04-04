const { Blockchain, Transaction } = require('./blockchain')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('029ae4da981227d3247828f5f3623c1272d8979052dd05c075803fd0de41b510');
const myWalletAddress = myKey.getPublic('hex');

//Demo time
let derekCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
derekCoin.addTransaction(tx1);

console.log('\n Starting the miner...');
derekCoin.minePendingTransaction(myWalletAddress);

console.log('\nBalance of address3 is ', derekCoin.getBalanceOfAddress(myWalletAddress));