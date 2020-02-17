const SocialNetwork = artifacts.require("./SocialNetwork.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("SocialNetwork", ([deployer, author, tipper]) => {
  let SocialNetwork;

  before(async () => {
    socialNetwork = await SocialNetwork.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfuly", async () => {
      const address = await socialNetwork.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await socialNetwork.name();
      assert.equal(name, "Uhuru Social Network");
    });
  });
});


describe('posts', async () => {
    let result

    it('creates posts', async () =>{
    result = await socialNetwork.createPost('This my first post', { from: author })
    postCount = await socialNetwork.postCount()
    // SUCESS

    assert.equal(postCount, 1)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
    assert.equal(event.content, 'This is my first post', 'content is correct')
    assert.equal(event.tipAmount, '0', 'tip amount is correct')
    assert.equal(event.author, author, 'author is correct')

    // FAILURE: POST MUST HAVE CONTENT
    await socialNetwork.createPost('', { from: author }).should.be.rejected;

    })
    it('list posts', async () =>{
      const post = await socialNetwork.posts(postCount)
    assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
    assert.equal(post.content, 'This is my first post', 'content is correct')
    assert.equal(post.tipAmount, '0', 'tip amount is correct')
    assert.equal(post.author, author, 'author is correct')
        
    })
  it('allows users to tip posts', async () =>{
    // Track the author balance before purchase
    let oldAuthorBalance
    oldAuthorBalance = await web3.eth.getBalance(author)
    oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)


    result = await socialNetwork.tipPost(postCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

// SUCESS
    
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
    assert.equal(event.content, 'This is my first post', 'content is correct')
    assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
    assert.equal(event.author, author, 'author is correct')

    // check that author received funds
    let newAuthorBalance
    oldAuthorBalance = await web3.eth.getBalance(author)
    oldAuthorBalance = new web3.utils.BN(newAuthorBalance)
    
    let tipAmount
    oldAuthorBalance = web3.utils.toWei('1', 'Ether')
    oldAuthorBalance = new web3.utils.BN(tipAmount)


    const exepectedBalance = oldAuthorBalance.add(tipAmount)

    assert.equal(newAuthorBalance.toString() exepectedBalance.toString())

    // FAILURE: Tries to tip a post that does not exit
    await socialNetwork.tipPost(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
        
    })
})
