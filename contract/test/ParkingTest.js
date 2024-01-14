const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
const { ethers } = require("hardhat")

  describe("ParkingTest", async function () {
    const EXTIME = 1705251481
    const PRICE = await ethers.parseEther("2");

    async function deployParkingLot() {    
        // Contracts are deployed using the first signer/account by default
        const [owner, ownerAccount, renterAccount] = await ethers.getSigners();
    
        const ParkingLot = await ethers.getContractFactory("ParkingLot");
        const parkingLot = await ParkingLot.deploy("FHDJEE", "FHDJEE"); // test parking lot code
    
        return { parkingLot, owner, ownerAccount, renterAccount };
      }
    
    async function deployRental(parkingLotContract) {
        // Contracts are deployed using the first signer/account by default    
        const Rental = await ethers.getContractFactory("Rental");
        const rental = await Rental.deploy(0, parkingLotContract);
    
        return { rental };
    }

    async function deployContracts() {
        const { parkingLot, owner, ownerAccount, renterAccount } = await deployParkingLot()
        const { rental } = await deployRental(parkingLot.target)
        
        return { parkingLot, rental, owner, ownerAccount, renterAccount }
    }

    async function safeMintFlow() {
        const { parkingLot, rental, owner, ownerAccount, renterAccount } = await deployContracts()
        await parkingLot.safeMint(ownerAccount.address, rental.target)
        return { parkingLot, rental, owner, ownerAccount, renterAccount }
    }

    async function registerFlow() {
        const { parkingLot, rental, owner, ownerAccount, renterAccount } = await safeMintFlow()
        await rental.connect(ownerAccount).register(EXTIME, PRICE)
        return { parkingLot, rental, owner, ownerAccount, renterAccount }
    }

    async function rentFlow() {
        const { parkingLot, rental, owner, ownerAccount, renterAccount } = await registerFlow()
        await rental.connect(renterAccount).rent({ value: PRICE })
        return { parkingLot, rental, owner, ownerAccount, renterAccount }
    }

    async function settleFlow() {
        const { parkingLot, rental, owner, ownerAccount, renterAccount } = await rentFlow()
        await rental.connect(ownerAccount).settle()
        return { parkingLot, rental, owner, ownerAccount, renterAccount }
    }

    it("safeMint", async () => {
        const { parkingLot, rental, owner, ownerAccount, renterAccount } = await safeMintFlow()
        const spotManagerInfo = await parkingLot.spotManager(0)
        await expect(spotManagerInfo[1]).to.equal(rental.target)
    })

    it("register", async () => {
        const { parkingLot, rental, owner, ownerAccount, renterAccount } = await registerFlow()
        const rentalExTime = await rental.expiryTime()
        await expect(rentalExTime).to.equal(EXTIME)
    })

    // ParkingLot
    it("rent_usable check", async () => {
        const { parkingLot, rental, owner, ownerAccount, renterAccount } = await rentFlow()
        const spotManagerInfo = await parkingLot.spotManager(0)
        await expect(spotManagerInfo[0]).to.equal(renterAccount.address)
    })

    // Rental
    it("rent_renter check", async () => {
        const { parkingLot, rental, owner, ownerAccount, renterAccount } = await rentFlow()
        const renter = await rental.renter()
        await expect(renter).to.equal(renterAccount.address)
    })

    it("settle", async () => {
        const { parkingLot, rental, owner, ownerAccount, renterAccount } = await settleFlow()
        const balance = await ethers.provider.getBalance(ownerAccount)
        const bal = Number(ethers.formatEther(balance).split(".")[0])
        await expect(bal).to.equal(10001)
    })
  })