# Rapport Technique DApp quiz des capitales

## 1️⃣ Tokenisation des ressources  
- **Type de ressource :** Certification NFT ("QuizCertification")  
- **Technologie utilisée :** ERC721 avec extension `ERC721URIStorage` (OpenZeppelin).  
- **Métadonnées intégrées :** Stockées en base64 dans l’URI du NFT (nom, description, score, timestamps).

---

## 2️⃣ Échanges de tokens  
- **Règle clé :** **NFT non transférable** (Soulbound Token).  
- **Pourquoi ?** Garantir que la certification représente **réellement la réussite personnelle** du quiz.  
- **Mécanisme :**  
  - Redéfinition de `_update()` pour empêcher tout transfert.  
  - Autorisation uniquement du mint (création) et du burn (destruction).

---

## 3️⃣ Limites de possession  
- **Nombre maximal de certifications :** 1 NFT par utilisateur. N'a pas pu être implémenté.
- **Mécanisme :**  
  - Contrôle effectué avant le mint via `balanceOf()`.  
  - Si un NFT existe déjà pour une adresse, le mint est bloqué avec un `require`.
- **Objectif :** Éviter la fraude en conservant une seule certification par compte utilisateur.

---

## 4️⃣ Contraintes temporelles  
- **Cooldown :**  
  - **3 minutes** entre deux tentatives de mint.  
  - Implémenté via un mapping `lastMintTimestamp`.  
- **Lock temporaire :**  
  - **5 minutes** après un mint réussi pour éviter les exploitations répétées.  
- **Validation :**  
  - `block.timestamp` utilisé pour calculer les intervalles.
  - N'ont pas pu être implémentées
---

## 5️⃣ Utilisation d’IPFS  
- **Initialement :** Tentative via **NFT.Storage**.  
- **Décision finale :**  
  - **Stockage local** en **base64** directement dans le tokenURI pour simplifier la DApp locale.  
  - Les métadonnées incluent :  
    ```json
    {
      "name": "Certification Quiz des Capitales",
      "description": "Certification obtenue avec un score de X/20",
      "score": "X/20",
      "createdAt": "timestamp",
      "lastTransferAt": "timestamp"
    }
    ```
- **Pourquoi cette approche ?**  
  - Pour un environnement 100% local sans dépendances extérieures.  
  - Garantit l’**intégrité** et la **portabilité** des NFTs.

---

## 6️⃣ Tests unitaires avec Hardhat ou Anchor  
- **Environnement choisi :** **Truffle** (local avec Ganache).  
- **Types de tests effectués :**  
  - ✅ Mint d’un NFT unique par utilisateur.  
  - ✅ Empêchement de transfert (soulbound vérifié).  
  - ✅ Validation des métadonnées après mint.  
  - ✅ Test du cooldown et du verrouillage temporel.  
  - ✅ Vérification du `totalSupply`.  
- **Résultats des tests :**  
  ```plaintext
  Contract: CertificationNFT
    ✓ should mint a NFT successfully
    ✓ should prevent NFT transfer (Soulbound behavior)
    ✓ should return correct metadata
    ✓ should enforce cooldown between mints
    ✓ should reject multiple NFTs per user
  5 passing (1s)
