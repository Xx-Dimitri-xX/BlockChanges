// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CertificationNFT
 * @dev NFT non transferable avec URI stockée localement (base64).
 */
contract CertificationNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    constructor() ERC721("QuizCertification", "QUIZCERT") {}

    /// @notice Mint un NFT avec une URI encodee en base64
    /// @param to Adresse du receveur
    /// @param tokenURI URI du token encodee en base64
    function mint(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;
        _safeMint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    /// @notice Empêche le transfert (soulbound)
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
        require(from == address(0) || to == address(0), "NFT non transferable");
        super._beforeTokenTransfer(from, to, tokenId);
    }
}