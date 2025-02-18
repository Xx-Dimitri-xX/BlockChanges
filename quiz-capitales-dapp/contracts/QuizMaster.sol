// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title QuizMaster
 * @dev Quiz sur les capitales avec NFT de certification si le score est sup à 15/20
 */
contract QuizMaster is ReentrancyGuard {
    struct Question {
        string ipfsHash; // CID IPFS avec la question et les 4 réponses
        bytes32 correctAnswerHash;
    }

    mapping(uint256 => Question) public questions;
    mapping(address => uint256) public userScores;
    mapping(address => uint256) public lastAction;

    IERC721 public certificateNFT;

    uint256 public constant COOLDOWN = 30 seconds;
    uint256 public constant TOTAL_QUESTIONS = 20;
    uint256 public constant REQUIRED_SCORE = 15;

    event QuestionAnswered(address indexed user, bool correct);
    event CertificateMinted(address indexed user);

    constructor(address _certificateNFT) {
        certificateNFT = IERC721(_certificateNFT);
    }

    /// @notice Répond à une question
    function answerQuestion(uint256 questionId, bytes32 answerHash) external nonReentrant {
        require(block.timestamp >= lastAction[msg.sender] + COOLDOWN, "Cooldown actif, attendez 30s");
        require(questionId < TOTAL_QUESTIONS, "Question ID invalide");

        Question memory q = questions[questionId];
        require(q.correctAnswerHash != bytes32(0), "Question inexistante");

        bool correct = (answerHash == q.correctAnswerHash);
        if (correct) {
            userScores[msg.sender]++;
        }

        lastAction[msg.sender] = block.timestamp;
        emit QuestionAnswered(msg.sender, correct);
    }

    /// @notice Minter le NFT si score sup à 15
    function claimCertificate() external {
        require(userScores[msg.sender] >= REQUIRED_SCORE, "Score insuffisant (min. 15)");
        uint256 tokenId = uint256(uint160(msg.sender));
        require(certificateNFT.ownerOf(tokenId) == address(0), "Certificat deja emis");

        certificateNFT.safeTransferFrom(address(this), msg.sender, tokenId);
        emit CertificateMinted(msg.sender);
    }

    /// @notice Ajout d'une question
    function addQuestion(uint256 questionId, string memory ipfsHash, bytes32 answerHash) external {
        require(questionId < TOTAL_QUESTIONS, "ID question invalide");
        questions[questionId] = Question(ipfsHash, answerHash);
    }
}