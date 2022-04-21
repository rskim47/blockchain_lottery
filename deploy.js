const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
require('dotenv').config();

// Building Provider to Rinkeby Test Network 
const provider = new HDWalletProvider(
  process.env.NUM,
  process.env.RINKEBY
);

const web3 = new Web3(provider);
const log = (content) => { console.log(content) }

// Utilizing Async / Await
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  log(accounts)
  log("attempting to deploy account", accounts);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[ 0 ] });

  log('Contract deployed to', result.options);
  log(result.options.address)
};

deploy().catch(err => log(err))