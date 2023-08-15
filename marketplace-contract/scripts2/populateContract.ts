// deployAndCall.js
const fs = require('fs');
const hre = require('hardhat');

async function main() {
    // Get command line arguments
    const args = process.argv.slice(2);
    if (args.length > 1 || args[0] != "thirdweb") {
        console.error('Usage: npx hardhat run populateContract.ts [thirdweb]');
        process.exit(1);
    }
  
    const configFilePath = args[0];
    const config = JSON.parse(fs.readFileSync(configFilePath));
  
    // Rest of the script remains the same
    // ...
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });