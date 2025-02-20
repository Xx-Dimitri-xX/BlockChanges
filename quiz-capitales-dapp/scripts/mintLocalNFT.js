const fs = require('fs');
const path = require('path');
const CertificationNFT = artifacts.require("CertificationNFT");

module.exports = async function (callback) {
    try {
        const nft = await CertificationNFT.deployed();
        const accounts = await web3.eth.getAccounts();
        const deployer = accounts[0];
        console.log(`Mintage en cours avec le compte ${deployer}`);

        const metadataDir = path.join(__dirname, '..', 'metadata');
        const files = fs.readdirSync(metadataDir).filter(file => file.endsWith('.json'));

        for (const file of files) {
            console.log(`Lecture du fichier ${file}`);
            const metadata = JSON.parse(fs.readFileSync(path.join(metadataDir, file), 'utf8'));

            const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString('base64')}`;

            await nft.mint(deployer, tokenURI);
            console.log(`NFT minté avec succès : ${file}`);
        }
        console.log(`${files.length} NFTs mintés localement avec succès`);
        callback();
    } catch (error) {
        console.error("Erreur lors du minte :", error);
        callback(error);
    }
};
