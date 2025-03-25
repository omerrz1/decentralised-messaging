const hre = require("hardhat");

async function main() {
  const MessageStorage = await hre.ethers.getContractFactory("MessageStorage");
  const messageStorage = await MessageStorage.deploy();

  // Wait for the deployment to complete
  await messageStorage.waitForDeployment();

  console.log("MessageStorage deployed to:", await messageStorage.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});