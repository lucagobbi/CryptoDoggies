const DoggyContract = artifacts.require("DoggyContract");

module.exports = function (deployer) {
  deployer.deploy(DoggyContract);
};
