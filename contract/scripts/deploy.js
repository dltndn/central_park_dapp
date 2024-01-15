// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const ethers = hre.ethers

const PARKINGLOT_ADDRESS = "0x13BE3A8531b47921DC2C3910bB016836422c72a6"
const RENTAL_0_ADDRESS = "0x0D1B0701F759BC2A51f8B51744dfD147ee4BaC27"
const RENTAL_1_ADDRESS = "0x5C270CAf892bD0D080242C28a91099470Afb3381"
const TOKEN_0_OWNER = "0x1e1864802DcF4A0527EF4315Da37D135f6D1B64B"
const TOKEN_1_OWNER = "0x521D5d2d40C80BAe1fec2e75B76EC03eaB82b4E0"

async function main() {
  const deployParkingLot = async () => {
    const parkingLot = await ethers.deployContract("ParkingLot", ["FHDJEE", "FHDJEE"])
    await parkingLot.waitForDeployment();
    console.log(`parkingLot address: ${parkingLot.target}`)
  }

  const deployRental = async (tokenId, parkingLotAdr) => {
    const rental = await ethers.deployContract("Rental", [tokenId, parkingLotAdr])
    await rental.waitForDeployment();
    console.log(`tokenId: ${tokenId}, rental address: ${rental.target}`)
  }

  const safeMint = async (toAdr, rentalAdr) => {
    const ParkingLot = await ethers.getContractFactory("ParkingLot")
    const parkingLot = ParkingLot.attach(PARKINGLOT_ADDRESS)
    const result = await parkingLot.safeMint(toAdr, rentalAdr)
    console.log("safeMint result: ", result)
  }

  // await deployRental(0, "0x13BE3A8531b47921DC2C3910bB016836422c72a6")
  // await deployRental(0, PARKINGLOT_ADDRESS)
  // await deployRental(1, PARKINGLOT_ADDRESS)

  // await safeMint(TOKEN_1_OWNER, RENTAL_1_ADDRESS)
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
