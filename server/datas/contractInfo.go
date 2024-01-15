package datas

type parkingCaStruct struct {
	contractAddress string
	rentalAddress   []string
}

var caInfo = [1]parkingCaStruct{{contractAddress: "0x", rentalAddress: []string{"0x1"}}}

func GetParkingLotContracts() [1]parkingCaStruct {
	return caInfo
}

func GetRentalContracts(caAddress string) []string {
	for _, paCaInfo := range caInfo {
		if paCaInfo.contractAddress == caAddress {
			return paCaInfo.rentalAddress
		}
	}
	return nil
}
