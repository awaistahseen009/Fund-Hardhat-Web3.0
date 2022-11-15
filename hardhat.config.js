require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy")
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const GOERLI_RPC_URL=process.env.GOERLI_RPC_URL
const GOERLI_API_KEY=process.env.GOERLI_API_KEY
const ETHERSCAN_API_KEY=process.env.ETHERSCAN_API_KEY
module.exports = {
 // solidity: "0.8.4",
  solidity:{
    compilers:[
      {"version":"0.8.8"},
      {"version":"0.6.6"},
      {"version":"0.8.4"},
  
    ]
  },
 networks: {
    goerli:{
      url:GOERLI_RPC_URL,
      accounts:[GOERLI_API_KEY],
      chainId:5,
      blockConfirmation:5
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY ,
  },
  namedAccounts:{
    deployer:{
      default:0,
      deployer :0
      //we can also specify which network has which deployer
    },
  }
};
