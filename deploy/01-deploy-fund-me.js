//import from helper

const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config.js");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");

// we want to use anonymus async function
// hre-hardhat runtime env
module.exports = async (hre) => {
  //this two variables comes from hre
  const { getNamedAccounts, deployments } = hre;
  // hre.getNamedAccounts
  // hre.deployments
  // module.exports = async ({ getNamedAccounts, deployments }) => {

  //using deployments obj to get two function
  const { deploy, log } = deployments;

  //we are going to grab deployer account from our named account
  //namedaccount is in hardhat.config.js
  const { deployer } = await getNamedAccounts();

  //defining chainid
  const chainId = network.config.chainId;


  //if we want to use mocks for pricefeed,for localhost or hardhat network
  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  }
  //if we are not on development chain
  else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  // we will use own mocks contract if we doesnt' have network
  //if contract doesn't exist - we deploy a minimal version for our local testing

  //what happend when we want to change chain?
  //when going for localhost or hardhat we want to use mocks

  //we will use just deploy function

  log("----------------------------------------------------");
  log("Deploying FundMe and waiting for confirmations...");
  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    //name of contract which we want to deploy
    from: deployer,
    args: args,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
    // || 1 means - if there is no blockConfirmations defined in our configuration file, that we wait for only one block
  });
  log(`FundMe deployed at ${fundMe.address}`);
  if (
    //verify only if ethscan apy key exist and we are not on local network
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    //verify
    await verify(fundMe.address, args);
  }
  log("------------------------");
};

module.exports.tags = ["all", "fundme"];
