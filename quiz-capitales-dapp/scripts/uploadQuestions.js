const fs = require('fs');
const path = require('path');

// 📁 Dossier contenant les métadonnées générées
const metadataDir = path.join(__dirname, '..', 'metadata');
// 📂 Fichier contenant toutes les questions
const questionsFilePath = path.join(__dirname, '..', 'assets', 'questions.json');

// ✅ Créer le dossier 'metadata' s'il n'existe pas
if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir);
}

async function generateMetadataFromFile() {
    try {
        // 🔄 Lire et parser le fichier 'questions.json'
        const questionsData = fs.readFileSync(questionsFilePath, 'utf8');
        const questions = JSON.parse(questionsData);

        console.log(`📚 ${questions.length} questions chargees depuis 'questions.json'.`);

        // ⚡️ Générer un fichier JSON pour chaque question
        questions.forEach((question, index) => {
            const enrichedQuestion = {
                ...question,
                previousOwners: [],
                createdAt: Date.now(),
                lastTransferAt: Date.now()
            };

            const filePath = path.join(metadataDir, `question${index + 1}.json`);
            fs.writeFileSync(filePath, JSON.stringify(enrichedQuestion, null, 2));
            console.log(`✅ Métadonnée générée : ${filePath}`);
        });

        console.log(`🎉 Toutes les questions ont été générées dans '${metadataDir}' !`);
    } catch (error) {
        console.error("❌ Erreur lors de la génération des métadonnées :", error);
    }
}

// 🚀 Lancer la génération
generateMetadataFromFile();
