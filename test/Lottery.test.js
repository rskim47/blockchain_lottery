const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let lottery, accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[ 0 ], gas: 1000000 });
});

describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('Allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[ 0 ],
      value: web3.utils.toWei('0.02', 'ether') // eth => wei conversion
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[ 0 ]
    });

    assert.equal(accounts[ 0 ], players[ 0 ]);
    assert.equal(1, players.length);
  });

  it('Allows multiple account to enter', async () => {
    // Ading accounts 
    for (let i = 0; i < accounts.length; i++) {
      await lottery.methods.enter().send({
        from: accounts[ i ],
        value: web3.utils.toWei('0.02', 'ether') // eth => wei conversion
      });
    }

    const players = await lottery.methods.getPlayers().call({
      from: accounts[ 0 ]
    });


    for (let i = 0; i < accounts.length; i++) {
      assert.equal(accounts[ i ], players[ i ]);
    }
    assert.equal(accounts.length, players.length);
  });

  it('requires minimum amount of ether', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[ 0 ],
        value: 200
      });
      assert(false)
    } catch (err) {
      assert(err);
    }
  });

  it('only manager can call pick winner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[ 1 ] // Non-manager account
      });
      assert(false)
    } catch (err) {
      assert(err);
    }
  });

  it('sends money to the winner and resets the players array', async () => {
    await lottery.methods.enter().send({
      from: accounts[ 0 ],
      value: web3.utils.toWei('2', 'ether') // eth => wei conversion
    });

    const initialBalance = await web3.eth.getBalance();

  });
});