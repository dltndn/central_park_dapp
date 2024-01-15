package datas

type parkingCaStruct struct {
	contractAddress string
	rentalAddress   []string
}

var caInfo = [1]parkingCaStruct{{contractAddress: "0x13BE3A8531b47921DC2C3910bB016836422c72a6", rentalAddress: []string{"0x1"}}}

func GetParkingLotContracts() string {
	return caInfo[0].contractAddress
}

func GetRentalContracts(caAddress string) []string {
	for _, paCaInfo := range caInfo {
		if paCaInfo.contractAddress == caAddress {
			return paCaInfo.rentalAddress
		}
	}
	return nil
}

//(c *parkingCaStruct)
