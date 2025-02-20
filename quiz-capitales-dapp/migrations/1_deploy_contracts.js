const CertificationNFT = artifacts.require("CertificationNFT");

module.exports = async function (deployer, network, accounts) {
    const owner = accounts[0];
    await deployer.deploy(CertificationNFT, owner);
};
