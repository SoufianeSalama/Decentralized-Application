/*
* API using JS Express
* Hyperledger Fabric network connection file 
* Soufiane Salama
* (Based on 'evote' application of Horea Porutiu (IBM Developer))
*/

'use strict';

const { Gateway, FileSystemWallet} = require('fabric-network');
const path = require('path');
const fs = require('fs');


// Load network configuration 
const ccpPath = path.resolve(__dirname, '..', '..','..','..', 'first-network', 'connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));



////////////////////////////////////////
// Function: connectToNetwork()
exports.connectToNetwork = async function (){
    try {
        // Create wallet
        const walletPath = path.join(process.cwd(), 'wallet');
        console.log(`Wallet path: ${walletPath}`);
        const wallet = new FileSystemWallet(walletPath);

        // Check if user is registred
        const identity = await wallet.exists('user1');
        if (!identity) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Gateway creation for connection to the peer
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the channel
        const network = await gateway.getNetwork('mychannel');

        // Get the contract
        const contract = network.getContract('fabcar');

        let networkConnection = {
            gateway: gateway,
            network: network,
            contract: contract
        }
        return networkConnection;
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return error;
    } finally {
        console.log('Connection to network succeeded');
    }
}

////////////////////////////////////////
// Function: invoke()
exports.invoke = async function (networkConnection, functionName, args){
    let response;
    try {
       switch (functionName) {
            case "queryAllCars":
                console.log(`Transaction ${functionName} has been submitted`);
                response = await networkConnection.contract.evaluateTransaction('queryAllCars');
                
                break;

            case "queryCar":
                console.log(`Transaction ${functionName} with args ${args} has been submitted`);
                response = await networkConnection.contract.evaluateTransaction('queryCar', args);
                
                break;
       
           default:
               break;
       }
    
    }
    catch(error){
        console.error(`Failed to submit transaction: ${error}`);
        let response = {};
        response.error = error;
        return response;
    }
    return response;
}
