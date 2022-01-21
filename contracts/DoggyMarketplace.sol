//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.5.12;

import "./IDoggyMarketPlace.sol";
import "./Ownable.sol";

contract DoggyMarketPlace is Ownable, IDoggyMarketPlace {
    DoggyContract private _doggyContract;

    struct Offer {
        address payable seller;
        uint256 price;
        uint256 index;
        uint256 tokenId;
        bool active;
    }

    Offer[] offers;

    mapping(uint256 => Offer) tokenIdToOffer;

    function setDoggyContract(address _doggyContractAddress) public onlyOwner {
        _doggyContract = DoggyContract(_doggyContractAddress);
    }

    constructor(address _doggyContractAddress) public {
        setDoggyContract(_doggyContractAddress);
    }

    function getOffer(uint256 _tokenId)
        public
        view
        returns (
            address seller,
            uint256 price,
            uint256 index,
            uint256 tokenId,
            bool active
        )
    {
        Offer storage offer = tokenIdToOffer[_tokenId];
        return (
            offer.seller,
            offer.price,
            offer.index,
            offer.tokenId,
            offer.active
        );
    }

    function getAllTokenOnSale()
        public
        view
        returns (uint256[] memory listOfOffers)
    {
        uint256 totalOffers = offers.length;
        if (totalOffers == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](totalOffers);

            uint256 offerId;

            for (offerId = 0; offerId < totalOffers; offerId++) {
                if (offers[offerId].active == true) {
                    result[offerId] = offers[offerId].tokenId;
                }
            }
            return result;
        }
    }

    function _ownsDoggy(address _address, uint256 _tokenId)
        internal
        view
        returns (bool)
    {
        return (_doggyContract.ownerOf(_tokenId) == _address);
    }

    function setOffer(uint256 _price, uint256 _tokenId) public {
        require(
            _ownsDoggy(msg.sender, _tokenId),
            "You are not the owner of this Doggy"
        );
        require(
            tokenIdToOffer[_tokenId].active == false,
            " You can't sell this twice!"
        );
        require(
            _doggyContract.isApprovedForAll(msg.sender, address(this)),
            "Contract needs to be approved for all!"
        );

        Offer memory _offer = Offer({
            seller: msg.sender,
            price: _price,
            active: true,
            tokenId: _tokenId,
            index: offers.length
        });

        tokenIdToOffer[_tokenId] = _offer;
        offers.push(_offer);

        emit MarketTransaction("Create offer", msg.sender, _tokenId);
    }

    function removeOffer(uint256 _tokenId) public {
        Offer memory offer = tokenIdToOffer[_tokenId];
        require(
            offer.seller == msg.sender,
            "You are not the seller for this sale"
        );

        delete tokenIdToOffer[_tokenId];
        offers[tokenIdToOffer[_tokenId].index].active = false;

        emit MarketTransaction("Remove offer", msg.sender, _tokenId);
    }

    function buyDoggy(uint256 _tokenId) public payable {
        Offer memory offer = tokenIdToOffer[_tokenId];
        require(msg.value == offer.price, "The price is incorrect");
        require(
            tokenIdToOffer[_tokenId].active == true,
            "No active order present!"
        );

        delete tokenIdToOffer[_tokenId];
        offers[tokenIdToOffer[_tokenId].index].active = false;

        if (offer.price > 0) {
            offer.seller.transfer(offer.price);
        }

        _doggyContract.transferFrom(offer.seller, msg.sender, _tokenId);

        emit MarketTransaction("Buy", msg.sender, _tokenId);
    }
}
