const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { ethers } = require("ethers");
const CertificationNFTArtifact = require("../build/contracts/CertificationNFT.json");

// Config Ganache
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const contractAddress = "0x6b4156472c17839Dda1C3d261d21c5b9a83499Ca";

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

async function mintCertification(score, wallet) {
    if (score < 15) {
        console.log("Score insuffisant (<15/20). Pas de certification obtenue.");
        return;
    }

    console.log("🏆 Score suffisant ! Minte du NFT en cours...");

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

    try {
        const tx = await contract.mint(userAddress, tokenURI);
        await tx.wait();
        console.log(`NFT minté avec succès pour ${userAddress} !`);
    } catch (error) {
        if (error.message.includes("Max certifications reached")) {
            console.log("Vous avez déjà atteint le maximum de 2 certifications, impossible de minter un nouveau NFT.");
        } else {
            console.error("Erreur inattendue lors du mint :", error);
        }
    }
}

async function main() {
    const accounts = await provider.listAccounts();
    const wallet = provider.getSigner(accounts[0]);

    const address = await wallet.getAddress();
    console.log(`Compte utilisé : ${address}`);

    const score = await startQuiz();
    await mintCertification(score, wallet);
}

main().catch((error) => {
    console.error("Erreur globale :", error);
});
