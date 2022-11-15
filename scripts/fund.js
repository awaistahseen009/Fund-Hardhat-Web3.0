const { getNamedAccounts, ethers } = require("hardhat")

const main=async()=>{
const {deployer}=await getNamedAccounts()
const fundMe=await ethers.getContract("FundMe",deployer)
console.log("Funding the contract !!!")
const transaction=await fundMe.fund({value:ethers.utils.parseEther("1")})
await transaction.wait(1)
console.log("Funded !")
}
main().then(()=>process.exit(0))
.catch((error)=>{
  process.exit(1)
  console.error(error)
})