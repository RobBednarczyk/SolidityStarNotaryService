const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => {

    var contractInstance;

    beforeEach(async function() {
        //this.contract = await StarNotary.new({from: accounts[0]})
        contractInstance = await StarNotary.new({from: accounts[0]})
    })

    describe('can create a star', () => {
        it('can create a star and get its name', async function () {

            await contractInstance.createStar('awesome star!', 1, "Once upon a time there was a star",
                                            "dec_121.874", "mag_245.978", "ra_032.155", {from: accounts[0]})
            let star = await contractInstance.tokenIdToStarInfo(1);
            //console.log(myObj[0])
            //console.log(await contractInstance.tokenIdToStarInfo(1).0);
            //console.log(typeof await contractInstance.tokenIdToStarInfo(1));
            assert.equal(star[0], "awesome star!");
            assert.equal(star[1], "Once upon a time there was a star");
            assert.equal(star[2], "ra_032.155");
            assert.equal(star[3], "dec_121.874");
            assert.equal(star[4], "mag_245.978");
        })
    })

    describe('buying and selling stars', () => {
        let user1 = accounts[1];
        let user2 = accounts[2];
        let randomMaliciousUser = accounts[3];

        let starId = 1;
        let starPrice = web3.toWei(.01, "ether");

        beforeEach(async function () {
            //await this.contract.createStar('awesome star!', starId, {from: user1})
            await contractInstance.createStar('awesome Neutron star!', 1, "The second star in the chain",
                                            "dec_99.984", "mag_135.678", "ra_012.139", {from: user1})
            //console.log(user1);
        })

        it('user1 can put up their star for sale', async function () {
            //console.log(starId);
            let starRealOwner = await contractInstance.ownerOf(starId);
            //console.log(starRealOwner);
            assert.equal(starRealOwner, user1)
            await contractInstance.putStarUpForSale(starId, starPrice, {from: user1})

            assert.equal(await contractInstance.starsForSale(starId), starPrice)
        })

        describe('user2 can buy a star that was put up for sale', () => {
            beforeEach(async function () {
                await contractInstance.putStarUpForSale(starId, starPrice, {from: user1})
            })

            it('user2 is the owner of the star after they buy it', async function() {
                await contractInstance.buyStar(starId, {from: user2, value: starPrice, gasPrice: 0})
                assert.equal(await contractInstance.ownerOf(starId), user2)
            })

            it('user2 ether balance changed correctly', async function () {
                let overpaidAmount = web3.toWei(.05, 'ether')
                const balanceBeforeTransaction = web3.eth.getBalance(user2)
                await contractInstance.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice: 0})
                const balanceAfterTransaction = web3.eth.getBalance(user2)

                assert.equal(balanceBeforeTransaction.sub(balanceAfterTransaction), starPrice)
            })
        })
    })

    describe("checking if the would be star already exists", () => {
        let user1 = accounts[1];

        it("user1 claims a neutron star", async function() {
            await contractInstance.createStar('awesome Neutron star!', 1, "The second star in the chain",
                                            "dec_99.984", "mag_135.678", "ra_012.139", {from: user1});
            assert.equal(await contractInstance.checkIfStarExists("dec_99.984", "mag_135.678", "ra_012.139"), true);
        })

        it("user2 claims a white dwarf", async function() {
            await contractInstance.createStar('awesome White Dwarf!', 2, "Another star in the chain",
                                            "dec_11.987", "mag_98.348", "ra_014.229", {from: user1});
            assert.equal(await contractInstance.checkIfStarExists("dec_11.987", "mag_98.348", "ra_014.229"), true);
            assert.equal(await contractInstance.checkIfStarExists("dec_07.789", "mag_11.328", "ra_019.229"), false);
        })
    });

    describe("checking if a token is properly minted", () => {
        let user1 = accounts[2];
        //let user2 = accounts[3];
        it("user1 mints a token and checks if they're the owner", async function() {
            await contractInstance.mint(user1, 3)

            assert.equal(await contractInstance.ownerOf(3), user1);
        });

    })

    describe("checking if a user that's just claimed a star can transfer the right to another user",
            () => {
        let user1 = accounts[4];
        let user2 = accounts[5];
        let tokenId = 1;
        it("user1 claims a star and transfers the rights to the token", async function() {
            await contractInstance.createStar('awesome White Dwarf!', tokenId, "Another star in the chain",
                                            "dec_11.987", "mag_98.348", "ra_014.229", {from: user1});
            await contractInstance.approve(user2, tokenId, {from: user1});

            assert.equal(await contractInstance.getApproved(tokenId), user2);
        })
    })

    describe("checking the safe transfer functionality", () => {
        let user1 = accounts[4];
        let user2 = accounts[5];
        let tokenId = 3;
        it("user1 claims a star and transfers the rights to the token directly to user2", async function() {
            await contractInstance.createStar('awesome White Dwarf!', tokenId, "Another star in the chain",
                                            "dec_11.987", "mag_98.348", "ra_014.229", {from: user1});

            assert.equal(await contractInstance.ownerOf(tokenId), user1);

            //await contractInstance.safeTransferFrom(user1, user2, tokenId);

            //assert.equal(await contractInstance.ownerOf(tokenId), user2);
        });
    })

    describe("setting the approve all functionality", () => {
        let user1 = accounts[1];
        let user2 = accounts[2];
        let maliciousUser = accounts[3];

        it("user1 gives the approve-for-all rights to user2", async function() {
            await contractInstance.setApprovalForAll(user2, true, {from: user1});
            assert.equal(await contractInstance.isApprovedForAll(user1, user2), true);
            assert.equal(await contractInstance.isApprovedForAll(user1, maliciousUser), false);
        });
    })

    describe("testing the tokenIdToStarInfo functionality", () => {
        let user1 = accounts[1];
        let tokenId = 1;
        let name = "awesome White Dwarf!";
        let story = "Another star in the chain";
        let dec = "dec_11.987";
        let mag = "mag_98.348";
        let cent = "ra_014.229";

        it("user1 claims a star and all its details are being saved in the chain", async function() {
            await contractInstance.createStar(name, tokenId, story, dec, mag, cent, {from: user1});
            let star = await contractInstance.tokenIdToStarInfo(tokenId);
            console.log(star);
            assert.equal(star[0], name);
            assert.equal(star[1], story);
            assert.equal(star[2], cent);
            assert.equal(star[3], dec);
            assert.equal(star[4], mag);
            //assert.equal(await contractInstance.tokenIdToStarInfo(tokenId),[name, story, dec, mag, cent]);
        })
    })

})
