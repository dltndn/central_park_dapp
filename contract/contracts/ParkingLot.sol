// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ParkingLot is ERC721, Ownable {
    // 주차 자리 현재 상태
    struct SpotState {
        address usableAdress;
        address rentalContract;
        uint totalIncome;
    }

    uint public nextTokenId; // 새 token 발행을 위한 변수
    string public parkingLotCode; // 주차장 코드

    mapping(uint => SpotState) public spotManager; // tokenId별 현재 상태

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
        Ownable(_msgSender())
    {
        parkingLotCode = name_;
    }

    function safeMint(address _to, address _rentalContract) public onlyOwner {
        uint256 tokenId = nextTokenId++;
        _safeMint(_to, tokenId);
        spotManager[tokenId].usableAdress = _to;
        spotManager[tokenId].rentalContract = _rentalContract;
        spotManager[tokenId].totalIncome = 0;
    }

    /**
     * @dev rental컨트랙만 실행가능한 주차자리 상태 업데이트 함수
     */
    function updateSpotState(uint _tokenId, address _usableAdress, uint _income) external {
        require(_msgSender() == spotManager[_tokenId].rentalContract, "Sender is wrong.");
        spotManager[_tokenId].usableAdress = _usableAdress;
        spotManager[_tokenId].totalIncome += _income;
    }

    /**
     * @dev 관리자만 실행가능한 주차자리 상태 업데이트 함수
     */
    function emerUpdateSpotState(uint _tokenId, address _usableAdress, address _rentalContract, uint _totalIncome) external onlyOwner {
        spotManager[_tokenId].usableAdress = _usableAdress;
        spotManager[_tokenId].rentalContract = _rentalContract;
        spotManager[_tokenId].totalIncome = _totalIncome;
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(address from, address to, uint256 tokenId) public override {
        if (to == address(0)) {
            revert ERC721InvalidReceiver(address(0));
        }
        // Setting an "auth" arguments enables the `_isAuthorized` check which verifies that the token exists
        // (from != 0). Therefore, it is not needed to verify that the return value is not 0 here.
        address previousOwner = _update(to, tokenId, _msgSender());
        if (previousOwner != from) {
            revert ERC721IncorrectOwner(from, tokenId, previousOwner);
        }
        // 이하 추가된 코드
        if (spotManager[tokenId].usableAdress != previousOwner) {
            revert ERC721IncorrectOwner(from, tokenId, previousOwner); // 임시
        }
        spotManager[tokenId].usableAdress = to;
        spotManager[tokenId].totalIncome = 0;
    }
}