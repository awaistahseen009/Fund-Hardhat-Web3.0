const { network } = require("hardhat")
const {networkConfig,developmentChains} =require("../helper-hardhat-config.js")
module.exports=async({deployments,getNamedAccounts})=>{
    const {deploy,log,get}=deployments
    const {deployer}=await getNamedAccounts()
    if(developmentChains.includes(network.name)){
        log("Local network detected !!! Deploying mocks !!!")
        await deploy("MockV3Aggregator",{
            from:deployer,
            log:true,
            args:[8,200000000000]
        })
        log("Mocks Deployed !!!--------------------")
    }
}
module.exports.tags=["all","mocks"]