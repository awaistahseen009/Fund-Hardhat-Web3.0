const { getNamedAccounts,ethers,network } = require("hardhat")
const {developmentChains} =require("../../helper-hardhat-config")
const {assert}=require("chai")
developmentChains.includes(network.name)?describe.skip:
describe("FundMe",()=>{
    let fundMe,deployer
    const sendValue=ethers.utils.parseEther("0.05")
    beforeEach(async()=>{
        deployer=(await getNamedAccounts()).deployer
        fundMe=await ethers.getContract("FundMe",deployer)
    })
    it("it allows people to fund and withdraw",async()=>{
        await fundMe.fund({value:sendValue})
        await fundMe.withdraw()
        const endingBalance=await fundMe.provider.getBalance(fundMe.address)
        assert(endingBalance.toString(),"0")
    })
})