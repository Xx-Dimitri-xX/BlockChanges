require("@nomicfoundation/hardhat-toolbox");

module.exports = {
    solidity: "0.8.21",
    networks: {
        hardhat: {},
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL,
            accounts: [process.env.PRIVATE_KEY]
        }
    }
};
