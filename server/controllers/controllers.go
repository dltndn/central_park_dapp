package controllers

import (
	"github.com/dltndn/server/datas"
)

func GetOwnSpot(address string) string {
	// var tokenIds = []int{}
	parkingLotCa := datas.GetParkingLotContracts()[0].contractAddress
	// address가 소유 중인 tokenId 조회
	// 1. bc nextTokenId 조회
	// 2. bc nextTokenId 전까지 ownerOf 순회
	// 3. tokenId 정보 조회
	return parkingLotCa
}
