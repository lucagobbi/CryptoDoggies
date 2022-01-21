//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.5.12;

import "./IERC721.sol";
import "./IERC721Receiver.sol";
import "./Ownable.sol";

contract DoggyContract is IERC721, Ownable {
    string public constant tokenName = "Doggies";
    string public constant tokenSymbol = "DOG";
    uint32 CREATION_LIMIT_GEN0 = 10;

    bytes4 internal constant MAGIC_ERC721_RECEIVED =
        bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));

    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;
    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;

    event Birth(
        address owner,
        uint256 doggyId,
        uint256 mumId,
        uint256 dadId,
        uint256 genes
    );

    struct Doggy {
        uint256 genes;
        uint64 birthTime;
        uint32 mumId;
        uint32 dadId;
        uint16 generation;
    }

    Doggy[] doggies;

    mapping(address => uint256) tokenCount;
    mapping(uint256 => address) tokenOwner;
    mapping(uint256 => address) public doggyIndexToApproved;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    uint256 gen0Counter;

    function supportsInterface(bytes4 _interfaceId)
        external
        pure
        returns (bool)
    {
        return (_interfaceId == _INTERFACE_ID_ERC721 ||
            _interfaceId == _INTERFACE_ID_ERC165);
    }

    function breed(uint256 _dadId, uint256 _mumId) public returns (uint256) {
        require(
            msg.sender == tokenOwner[_dadId] &&
                msg.sender == tokenOwner[_mumId],
            "You are not the owner of the parents!"
        );
        uint256 dadDna = doggies[_dadId].genes;
        uint256 mumDna = doggies[_mumId].genes;
        uint256 newDna = _mixDna(dadDna, mumDna);
        uint16 newGeneration;

        if (doggies[_dadId].generation >= doggies[_mumId].generation) {
            newGeneration = doggies[_dadId].generation++;
        } else {
            newGeneration = doggies[_mumId].generation++;
        }

        _createDoggy(_mumId, _dadId, newGeneration, newDna, msg.sender);
    }

    function createDoggyGen0(uint256 _genes)
        public
        onlyOwner
        returns (uint256)
    {
        require(gen0Counter < CREATION_LIMIT_GEN0);

        gen0Counter++;

        return _createDoggy(0, 0, 0, _genes, msg.sender);
    }

    function _createDoggy(
        uint256 _mumId,
        uint256 _dadId,
        uint256 _generation,
        uint256 _genes,
        address _owner
    ) internal returns (uint256) {
        Doggy memory _doggy = Doggy({
            genes: _genes,
            birthTime: uint64(now),
            mumId: uint32(_mumId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });

        uint256 newDoggyId = doggies.push(_doggy) - 1;

        emit Birth(_owner, newDoggyId, _mumId, _dadId, _genes);

        _transfer(address(0), _owner, newDoggyId);

        return newDoggyId;
    }

    function countDoggies() external view returns (uint256) {
        return doggies.length;
    }

    function balanceOf(address owner) external view returns (uint256 balance) {
        return tokenCount[owner];
    }

    function totalSupply() external view returns (uint256 total) {
        return doggies.length;
    }

    function name() external view returns (string memory) {
        return tokenName;
    }

    function symbol() external view returns (string memory) {
        return tokenSymbol;
    }

    function ownerOf(uint256 tokenId) external view returns (address owner) {
        require(
            tokenOwner[tokenId] != address(0),
            "This token does not exist!"
        );
        return tokenOwner[tokenId];
    }

    function getDoggy(uint256 tokenId)
        external
        view
        returns (
            uint256,
            uint64,
            uint32,
            uint32,
            uint16,
            address owner
        )
    {
        Doggy storage doggy = doggies[tokenId];
        return (
            doggy.genes,
            doggy.birthTime,
            doggy.mumId,
            doggy.dadId,
            doggy.generation,
            tokenOwner[tokenId]
        );
    }

    function transfer(address to, uint256 tokenId) external {
        require(to != address(0), "The receiver cannot be the zero address!");
        require(
            to != address(this),
            "The receiver cannot be the contract address!"
        );
        require(
            tokenOwner[tokenId] == msg.sender,
            "You do not own this token!"
        );

        _transfer(msg.sender, to, tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external {
        require(
            msg.sender == tokenOwner[tokenId] ||
                _operatorApprovals[from][msg.sender] == true ||
                msg.sender == doggyIndexToApproved[tokenId],
            "You are not allowed to transfer this token!"
        );
        require(
            from == tokenOwner[tokenId],
            "From paramet is not the owner of the token!"
        );
        require(
            to != address(0),
            "Transfer could not be directed to the zero address!"
        );
        require(tokenId < doggies.length, "This token does not exist!");

        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public {
        require(
            msg.sender == tokenOwner[tokenId] ||
                _operatorApprovals[from][msg.sender] == true ||
                msg.sender == doggyIndexToApproved[tokenId],
            "You are not allowed to transfer this token!"
        );
        require(
            from == tokenOwner[tokenId],
            "From paramet is not the owner of the token!"
        );
        require(
            to != address(0),
            "Transfer could not be directed to the zero address!"
        );
        require(tokenId < doggies.length, "This token does not exist!");

        _safeTransfer(from, to, tokenId, data);
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        tokenCount[_to]++;
        tokenOwner[_tokenId] = _to;

        if (_from != address(0)) {
            tokenCount[_from]--;
            delete doggyIndexToApproved[_tokenId];
        }

        emit Transfer(msg.sender, _to, _tokenId);
    }

    function _safeTransfer(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) internal {
        _transfer(_from, _to, _tokenId);

        require(_checkERC721Support(_from, _to, _tokenId, _data));
    }

    function approve(address approved, uint256 tokenId) external {
        require(
            msg.sender == tokenOwner[tokenId] ||
                msg.sender == doggyIndexToApproved[tokenId],
            "You are not allowed to approve this token!"
        );

        _approve(approved, tokenId);
    }

    function _approve(address _approved, uint256 _tokenId) internal {
        doggyIndexToApproved[_tokenId] = _approved;

        emit Approval(msg.sender, _approved, _tokenId);
    }

    function setApprovalForAll(address operator, bool approved) external {
        require(operator != msg.sender);

        _setApprovalForAll(operator, approved);
    }

    function _setApprovalForAll(address _operator, bool _approved) internal {
        _operatorApprovals[msg.sender][_operator] = _approved;

        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function getApproved(uint256 tokenId) external view returns (address) {
        require(tokenId < doggies.length, "This token does not exist!");

        return doggyIndexToApproved[tokenId];
    }

    function isApprovedForAll(address owner, address operator)
        external
        view
        returns (bool)
    {
        return _operatorApprovals[owner][operator];
    }

    function _checkERC721Support(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) internal returns (bool) {
        if (!_isContract(_to)) {
            return true;
        }

        bytes4 returnData = IERC721Receiver(_to).onERC721Received(
            msg.sender,
            _from,
            _tokenId,
            _data
        );
        return returnData == MAGIC_ERC721_RECEIVED;
    }

    function _isContract(address _to) internal view returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(_to)
        }
        return size > 0;
    }

    function _mixDna(uint256 _dadDna, uint256 _mumDna)
        internal
        pure
        returns (uint256)
    {
        uint256 firstHalf = _dadDna / 100000;
        uint256 secondHalf = (_mumDna / 10) % 10000;
        uint256 gender = (firstHalf + secondHalf) % 2;
        uint256 resultDna = (firstHalf * 100000) + (secondHalf * 10) + gender;
        return resultDna;
    }

    function _own(address claimant, uint256 tokenId)
        external
        view
        returns (bool)
    {
        return tokenOwner[tokenId] == claimant;
    }
}
