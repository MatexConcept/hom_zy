require("@matterlabs/hardhat-zksync-solc");

/** @type import('hardhat/config').HardhatUserConfig */
const PRIVATE_KEY = "2f0240fdd60666ee9c17d1e18702459ea4f66c5da4fdac50a729bb9c1027c1fd";
const RPC_URL = "https://rpc.ankr.com/polygon_mumbai";



module.exports = {
  defaultNetwork:"polygon_mumbai",
  networks:{
    hardhat:{
      chainId:80001,
    },
    polygon_mumbai:{
      url:RPC_URL,
      accounts:[`0x${PRIVATE_KEY}`]
    }
  },

  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
