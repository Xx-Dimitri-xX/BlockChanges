const CertificationNFT = artifacts.require("CertificationNFT");

contract("CertificationNFT", (accounts) => {
    let nft;
    const owner = accounts[0];
    const user = accounts[1];

    beforeEach(async () => {
        nft = await CertificationNFT.new(owner);
    });

    it("should mint a NFT successfully", async () => {
        const metadata = "data:application/json;base64," + Buffer.from(JSON.stringify({
            title: "Example NFT",
            description: "Test NFT for quiz"
        })).toString('base64');

        await nft.mint(user, metadata);
        const supply = await nft.totalSupply();
        assert.equal(supply.toString(), "1", "Total supply should be 1 after mint");
    });

    it("should prevent NFT transfer (Soulbound behavior)", async () => {
        const metadata = "data:application/json;base64," + Buffer.from(JSON.stringify({
            title: "Example NFT",
            description: "Test NFT for quiz"
        })).toString('base64');

        await nft.mint(user, metadata);
        try {
            await nft.transferFrom(user, accounts[2], 1, { from: user });
            assert.fail("Transfer should not be allowed for Soulbound NFT");
        } catch (error) {
            assert(error.message.includes("NFT non transferable"), "Expected Soulbound transfer error");
        }
    });

    it("should return correct metadata", async () => {
        const metadata = "data:application/json;base64," + Buffer.from(JSON.stringify({
            title: "Example NFT",
            description: "Test NFT for quiz"
        })).toString('base64');

        await nft.mint(user, metadata);
        const tokenURI = await nft.tokenURI(1);
        const decoded = Buffer.from(tokenURI.split(",")[1], "base64").toString();
        assert(decoded.includes("Example NFT"), "Metadata should contain 'Example NFT'");
    });
});

// truffle test