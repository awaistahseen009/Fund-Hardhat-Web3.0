const { getNamedAccounts, ethers } = require("hardhat")
const main=async()=>{
const {deployer}=await getNamedAccounts()
const fundMe=await ethers.getContract("FundMe",deployer)
console.log("Withdrawing in Process !!!")
const transaction=await fundMe.withdraw()
await transaction.wait(1)
console.log("Withdrawl Successfully !")
}
main().then(()=>process.exit(0))
.catch((error)=>{
  process.exit(1)
  console.error(error)
})