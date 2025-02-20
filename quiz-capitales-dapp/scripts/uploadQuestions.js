const fs = require('fs');
const path = require('path');

// Dossier contenant les métadonnées générés
const metadataDir = path.join(__dirname, '..', 'metadata');
// Fichier contenant toutes les questions
const questionsFilePath = path.join(__dirname, '..', 'assets', 'questions.json');

// Crée metadata s'il n'existe pas
if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir);
}

async function generateMetadataFromFile() {
    try {
        const questionsData = fs.readFileSync(questionsFilePath, 'utf8');
        const questions = JSON.parse(questionsData);

        console.log(`${questions.length} questions chargees depuis 'questions.json'.`);

        questions.forEach((question, index) => {
            const enrichedQuestion = {
                ...question,
                previousOwners: [],
                createdAt: Date.now(),
                lastTransferAt: Date.now()
            };

            const filePath = path.join(metadataDir, `question${index + 1}.json`);
            fs.writeFileSync(filePath, JSON.stringify(enrichedQuestion, null, 2));
            console.log(`Métadonnée générée : ${filePath}`);
        });

        console.log(`Toutes les questions sont générées dans '${metadataDir}' !`);
    } catch (error) {
        console.error("Erreur lors de la génération des métadonnées.", error);
    }
}

generateMetadataFromFile();
