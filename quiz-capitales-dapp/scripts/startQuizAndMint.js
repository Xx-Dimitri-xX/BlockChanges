const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { ethers } = require("ethers");
const CertificationNFTArtifact = require("../build/contracts/CertificationNFT.json");

// Config Ganache
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = provider.getSigner();
const contractAddress = "0x38c6043B86379beCadEF9447e7A5945f98D1F755"

const questionsData = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "assets", "questions.json"), "utf8"));

async function startQuiz() {
    console.log("Bienvenue au Quiz sur les capitales du monde !");
    let score = 0;

    for (let i = 0; i < questionsData.length; i++) {
        const q = questionsData[i];
        const answer = await inquirer.prompt([
            {
                type: "list",
                name: "response",
                message: `${i + 1}. ${q.question}`,
                choices: q.answers,
            },
        ]);
        if (answer.response === q.correctAnswer) {
            console.log("✅ Bonne réponse!");
            score++;
        } else {
            console.log(`❌ Mauvaise réponse. La bonne réponse était ${q.correctAnswer}`);
        }
    }
    console.log(`Quiz terminé ! Score final : ${score}/20`);
    return score;
}

async function mintCertification(score) {
    if (score >= 15) {
        console.log("🏆 Score suffisant ! Mint du NFT en cours...");

        const contract = new ethers.Contract(contractAddress, CertificationNFTArtifact.abi, wallet);

        const userAddress = await wallet.getAddress();
        console.log(`Adresse du wallet : ${userAddress}`);

        const metadata = {
            name: "Certification Quiz des Capitales",
            description: `Certification obtenue avec un score de ${score}/20.`,
            score: `${score}/20`,
            createdAt: Date.now(),
        };
        const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString("base64")}`;

        const tx = await contract.mint(userAddress, tokenURI);
        await tx.wait();
        console.log(`NFT minté avec succès pour ${userAddress} !`);
    } else {
        console.log("Score insuffisant (<15/20). Pas de certification obtenue.");
    }
}

async function main() {
    const accounts = await provider.listAccounts();
//    wallet = provider.getSigner(); // ✅ Correct pour ethers v6+
    console.log(`✅ Compte utilisé : ${wallet.address}`);
    const score = await startQuiz();
    await mintCertification(score);
}


main().catch((error) => {
    console.error("❌ Erreur :", error);
});