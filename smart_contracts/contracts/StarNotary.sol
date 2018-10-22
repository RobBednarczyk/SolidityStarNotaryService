pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 {

    struct Star {
        string name;
        string story;
        string dec;
        string mag;
        string cent;
    }

    //mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => Star) public tokenIdToStar;
    mapping(uint256 => uint256) public starsForSale;
    // store the hash value concatenated coordinates
    mapping(bytes32 => uint256) public hashedCoords;

    // store the star tokens in an array
    uint256[] public starsTokens;
    uint256[] public starsToBeSold;

    function createStar(string _name, uint256 _tokenId,
        string _story, string _dec, string _mag, string _cent) public {
        if (!checkIfStarExists(_dec, _mag, _cent)) {
            Star memory newStar = Star(_name, _story, _dec, _mag, _cent);
            // add the star token to the list
            starsTokens.push(_tokenId);
            // add the new Star to the mapping
            tokenIdToStar[_tokenId] = newStar;
            // add the hashed coords
            string memory concatCoords = strConcat(_dec, _mag, _cent);
            hashedCoords[keccak256(bytes(concatCoords))] = _tokenId;
            // mint the new token
            mint(msg.sender, _tokenId);
        }

    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(this.ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
        // add the token id to the starsToBeSold array
        starsToBeSold.push(_tokenId);
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }

    // check if the star already exists
    function checkIfStarExists(string _dec, string _mag, string _cent) public view returns(bool) {
        // get the total length of the array with star tokens
        string memory concatCoords = strConcat(_dec, _mag, _cent);
        if (hashedCoords[keccak256(bytes(concatCoords))] > 0) {
            return true;
        } else {
            return false;
        }

        // old version
        /*uint256 starRepoLength = starsTokens.length;
        // assume the star doesn't exist
        bool private exists = false;
        Star checkedStar;
        for (uint256 i=0; i < starRepoLength; i++) {
            // compare the star coords with the given arguments
            checkedStar = tokenIdToStarInfo[starsTokens(i)];
            if (keccak256(checkedStar.dec) == keccak256(_dec) &&
                keccak256(checkedStar.mag) == keccak256(_mag) &&
                keccak256(checkedStar.cent) == keccak256(_cent)) {
                    exists = true;
                }
        }
        return exists;*/
    }

    // add the functionality to mint the tokens
    function mint(address to, uint256 tokenId) public {
        // call the EC721 open zeppelin implementation
        ERC721._mint(to, tokenId);
    }

    // give other address the posibility to transfer a given token id
    function approve(address to, uint tokenId) public {
        // call the EC721 open zeppelin implementation
        ERC721.approve(to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        ERC721.safeTransferFrom(from, to, tokenId);
    }

    function setApprovalForAll(address to, bool approved) public {
        ERC721.setApprovalForAll(to, approved);
    }

    function getApproved(uint256 tokenId) public view returns(address) {
        return ERC721.getApproved(tokenId);
    }

    function isApprovedForAll(address owner, address operator) public view returns(bool) {
        return ERC721.isApprovedForAll(owner, operator);
    }

    function ownerOf(uint256 tokenId) public view returns(address) {
        return ERC721.ownerOf(tokenId);
    }

    function starsForSale(uint256 _tokenId) public view returns(uint256) {
        return starsForSale[_tokenId];
    }

    function tokenIdToStarInfo(uint256 _tokenId) public view returns(string, string, string, string, string) {
        Star memory star = tokenIdToStar[_tokenId];

        return(star.name, star.story, star.cent, star.dec, star.mag);

    }

    // functions to manually concatenate strings:
    // https://github.com/oraclize/ethereum-api/blob/master/oraclizeAPI_0.5.sol
    function strConcat(string _a, string _b, string _c, string _d, string _e) internal pure returns (string) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return string(babcde);
    }

    function strConcat(string _a, string _b, string _c, string _d) internal pure returns (string) {
        return strConcat(_a, _b, _c, _d, "");
    }

    function strConcat(string _a, string _b, string _c) internal pure returns (string) {
        return strConcat(_a, _b, _c, "", "");
    }

    function strConcat(string _a, string _b) internal pure returns (string) {
        return strConcat(_a, _b, "", "", "");
    }
}
