const networkConfig = {
  //chainid of hardhat
  31337: {
    name: "localhost",
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  5: {
    name: "goerli",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
};

const developmentChains = ["hardhat", "localhost"];

//for args in constructor of MockV3Aggregator
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

//we need module.export that other scripts can work with them
module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
};
