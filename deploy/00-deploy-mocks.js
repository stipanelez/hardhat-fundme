/**
 * @author Stipan Elez
 * @notice Almost like predeploy script
 * @notice We do this sometimes ,we don't need to deploy this on rinkeby or mainet
 * @notice We will make own mock price feed contract
 */
const { network } = require("hardhat");
//importing from helper-hardhat-config.js
const {
  developmentChains,
  DECIMALS, //decimals obj is decimals parameter
  INITIAL_ANSWER, //what is the price feed starting at
} = require("../helper-hardhat-config");

module.exports = async (hre) => {
  //this two variables comes from hre
  const { getNamedAccounts, deployments } = hre;
  // hre.getNamedAccounts
  // hre.deployments
  //module.exports = async ({ getNamedAccounts, deployments }) => {

  //using deployments obj to get two function
  const { deploy, log } = deployments;

  //we are going to grab deployer account from our named account
  //namedaccount is in hardhat.config.js
  const { deployer } = await getNamedAccounts();

  /*
//defining chainid
//we dont need it for this
    const chainId = network.config.chainId
*/

  //we dont want to deploy contract on testnet or rinkby which already have a pricefee
  //includes function that check to see if some variable is inside an array
  //because our helper config is using names
  if (developmentChains.includes(network.name)) {
    console.log("Local network detected! Deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      // log true means that we get all major printouts
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log("Mocks deployed!");
    log("------------------------");
  }
};

//on this way we can run only our deploy mocks script

module.exports.tags = ["all", "mocks"];
