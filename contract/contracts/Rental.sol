// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./ParkingLot.sol";

contract Rental is ParkingLot {
    ParkingLot public parkingLotContract; // 주차장 컨트랙 주소

    address public renter; // 주차 자리를 빌린 지갑 주소
    uint public expiryTime; // renter 사용 기한
    uint public price; // 대여료
    uint public tokenId; // tokenId
    uint private depositAmount; // renter가 납부한 코인 수량

    constructor(uint _tokenId, ParkingLot _parkingLotContract) ParkingLot("", "") {
        tokenId = _tokenId;
        parkingLotContract = _parkingLotContract;
    }

    /**
     * @dev token의 주인이 주차 자리를 렌트가 가능한 상태로 변경하는 함수
     */
    function register(uint _expiryTime, uint _price) external {
        require(_msgSender() == parkingLotContract.ownerOf(tokenId), "Only owner can register.");
        require(renter == address(0), "Someone has already rented.");
        require(block.timestamp < _expiryTime, "You can register the expiration time if it is bigger than current time.");
        require(_price > 0, "Price must be bigger than 0");
        expiryTime = _expiryTime;
        price = _price;
    }

    /**
     * @dev renter가 주차 자리를 rent하는 함수
     */
    function rent() payable external {
        require(renter == address(0), "Someone has already rented.");
        require(block.timestamp < expiryTime, "You can rent before the expiration time.");
        require(msg.value == price, "Value is wrong.");
        (bool success, ) = address(parkingLotContract).call(
            abi.encodeWithSignature(
                "updateSpotState(uint256,address,uint256)",
                tokenId,
                _msgSender(),
                0
            )
        );
        require(success);
        depositAmount += msg.value;
        renter = _msgSender();
    }

    /**
     * @dev 관리자만 실행가능한 주차자리 상태 업데이트 함수
     */
    function settle() external {
        address payable msgSender = payable(address(uint160(msg.sender)));
        require(msgSender == parkingLotContract.ownerOf(tokenId), "Only owner can settle.");
        require(block.timestamp > expiryTime, "You can settle after the expiration time.");
        require(renter != address(0), "Renter is empty.");
        (bool success, ) = address(parkingLotContract).call(
            abi.encodeWithSignature(
                "updateSpotState(uint256,address,uint256)",
                tokenId,
                msgSender,
                price
            )
        );
        require(success);
        expiryTime = 0;
        renter = address(0);
        msgSender.transfer(depositAmount);
        price = 0;
        depositAmount = 0;
    }

    function getParkingLotCode() view external returns(string memory){
        return parkingLotContract.parkingLotCode();
    }

    function setTokenId(uint _tokenId) external onlyOwner {
        tokenId = _tokenId;
    }
}