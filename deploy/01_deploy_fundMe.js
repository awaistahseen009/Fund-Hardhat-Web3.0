const { network } = require("hardhat")
require("dotenv").config()
const {verify}=require("../utils/verify.js")
const {networkConfig, developmentChains}=require("../helper-hardhat-config.js")
module.exports=async({getNamedAccounts,deployments})=>{
const {deploy,log,get}=deployments
const {deployer}=await getNamedAccounts()
const chainId=network.config.chainId
let ethUsdPriceFeed=""
if(developmentChains.includes(network.name)){
    const ethUsd=await get("MockV3Aggregator")
    ethUsdPriceFeed=ethUsd.address
}
else {
     ethUsdPriceFeed=networkConfig[chainId]["ethUsdPriceFeed"]
}
const fundMe=await deploy("FundMe",{
    from:deployer,
    args:[ethUsdPriceFeed],
    log:true,
    waitConfirmations:network.config.blockConfirmations || 1
})
if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
    await verify(fundMe.address,[ethUsdPriceFeed])
    log("Successfully Deployed the project Fund Me")
}
//when we are working on localhost we cant interact with the Rinkeby and Goerli networks address 
// so we deploy mocks to simulate the behaviour of real objects
}
module.exports.tags=["all","fundMe"]