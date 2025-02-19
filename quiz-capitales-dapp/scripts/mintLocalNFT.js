const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Mint en cours avec le compte :", deployer.address);

    const CertificationNFT = await ethers.getContractFactory("CertificationNFT");
    const nft = await CertificationNFT.deploy();
    await nft.deployed();
    console.log("🎉 Contrat CertificationNFT déployé à :", nft.address);

    const metadataDir = path.join(__dirname, '..', 'metadata');
    const files = fs.readdirSync(metadataDir).filter(file => file.endsWith('.json'));

    for (const file of files) {
        console.log(`Lecture du fichier : ${file}`);
        const metadata = JSON.parse(fs.readFileSync(path.join(metadataDir, file), 'utf8'));

        const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString('base64')}`;

        const tx = await nft.mint(deployer.address, tokenURI);
        await tx.wait();
        console.log(`NFT minté pour ${deployer.address} avec les métadonnées de ${file}`);
    }

    console.log(`${files.length} NFTs mintés avec succès !`);
}

main().catch((error) => {
    console.error("❌ Erreur lors du mint :", error);
    process.exitCode = 1;
});