// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CertificationNFT
 * @dev NFT non transferable servant de preuve de reussite au quiz.
 */
contract CertificationNFT is ERC721, Ownable {
    mapping(uint256 => bool) private locked;

    constructor() ERC721("QuizCertification", "QUIZCERT") {}

    /// @notice Mint un NFT de certification pour un utilisateur
    /// @param to Adresse du destinataire
    function mint(address to) external onlyOwner {
        uint256 tokenId = uint256(uint160(to));
        _safeMint(to, tokenId);
        locked[tokenId] = true;
    }

    /// @notice Bloque les transferts (soulbound)
    /// @dev Autorise uniquement les mint et les burn
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal override
    {
        require(from == address(0) || to == address(0), "NFT non transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
