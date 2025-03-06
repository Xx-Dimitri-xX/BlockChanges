// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CertificationNFT
 * @dev NFT soulbound délivrant une certif
 * Le NFT stocke les métadonnées localement via l'URI encodee en base64, chaque joueur peut en obtenir 2.
 */
contract CertificationNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    mapping(address => uint256) public mintedCount;
    uint256 public constant MAX_CERTIFICATIONS_PER_PLAYER = 2;

    /**
     * @dev Constructeur initialisant le token
     */
    constructor(address initialOwner) ERC721("QuizCertification", "QUIZCERT") Ownable(initialOwner) {}

    /**
     * @notice Minte NFT avec une URI spécifique
     * @param to adresse du receveur
     * @param tokenURI URI des métadonnées
     * @return newItemId newItemId ID du NFT minté
     */
    function mint(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        require(mintedCount[to] < MAX_CERTIFICATIONS_PER_PLAYER, "Max certifications reached");

        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _safeMint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);

        mintedCount[to]++;

        return newItemId;
    }

    /**
     * @notice Empêche le transfert du NFT
     * @dev Autorise le minte et le burn
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        address from = super._update(to, tokenId, auth);
        require(from == address(0) || to == address(0), "NFT non transferable");
        return from;
    }

    /**
     * @notice Nombre total de NFTs mintés
     * @return Le total des NFTs existants
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }
}
