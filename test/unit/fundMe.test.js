const { assert, expect } = require("chai")
const {deployments, ethers, getNamedAccounts}=require("hardhat")
describe("FundMe",()=>{
    const sendValue=ethers.utils.parseEther("1")
    let deployer, fundMe, mockV3Aggregator
    beforeEach(async()=>{
        deployer=(await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe=await ethers.getContract("FundMe",deployer)
        mockV3Aggregator=await ethers.getContract("MockV3Aggregator",deployer)
    })
    describe("constructor",()=>{
        it("Checking the price feed",async()=>{
            assert( mockV3Aggregator.address,await fundMe.PriceFeed())
        })
    })
    describe("Fund",()=>{
        it("sending the values",async()=>{
            await fundMe.fund({value:sendValue})
            const response=await fundMe.addMoneyMapping(deployer)       
            assert(response,sendValue)   
        })
        it("Funder address matching ",async()=>{
            await fundMe.fund({value:sendValue})
            const response=await fundMe.getFunder(0)
            assert.equal(deployer,response)   
        })
    })
    describe("Withdraw",()=>{
        beforeEach(async()=>{
            await fundMe.fund({value:sendValue})
        })
        it("It will successfull withdraw and checks the balance of contract and deployer",async()=>{
            const contractStartingBalance=await fundMe.provider.getBalance(fundMe.address)
            const deployerStartingBalance=await fundMe.provider.getBalance(deployer)
            const transaction=await fundMe.withdraw()
            const transactionReceipt=await transaction.wait()
            const {gasUsed,effectiveGasPrice}=transactionReceipt
            const deployerEndingBalance=await fundMe.provider.getBalance(deployer)
            const contractEndingBalance=await fundMe.provider.getBalance(fundMe.address)
            const gasCost=gasUsed.mul(effectiveGasPrice)
            assert.equal(contractEndingBalance,0)
            assert.equal((deployerEndingBalance.add(gasCost)).toString(),(deployerStartingBalance.add(contractStartingBalance)).toString());
        })
        it("Several funders are funding",async()=>{
            const accounts=await ethers.getSigners()
            for(let i=0;i<6;i++){
                await fundMe.connect(accounts[i])
                fundMe.fund({value:sendValue})
            }
            await fundMe.withdraw()
            for (let index = 0; index < 6; index++) {
                assert.equal(await fundMe.addMoneyMapping(accounts[index].address),0) 
            }
        })
        it("Only owner can withdraw the money",async()=>{
            const accounts=await ethers.getSigners()
            const attacker=await fundMe.connect(accounts[1])
            expect(await attacker.withdraw()).to.be.reverted
        })
    })
})