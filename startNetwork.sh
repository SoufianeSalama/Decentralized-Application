#!/bin/bash
#
# Script for starting the Hyperledger Fabric network (located in fabric_network)
# By Soufiane Salama
# For Fabric version 1.4.4
# based on the FabCar example script
# 

set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)

# Setting the language to JS
CC_RUNTIME_LANGUAGE=node # chaincode runtime language is node.js
CC_SRC_PATH=/opt/gopath/src/github.com/chaincode/fabcar/javascript

# clean the keystore
rm -rf ./hfc-key-store

# launch network; create channel and join peer to channel
cd ../aperam-network
./launchNetwork.sh
# echo y | ./byfn.sh up -a -n -s couchdb
# # Parameters explanation
# # -a    Launch certificates authorities
# # -n    do not deploy chaincode
# # -s couchdb    database type (leveldb = default)



CONFIG_ROOT=/opt/gopath/src/github.com/hyperledger/fabric/peer
ORG1_MSPCONFIGPATH=${CONFIG_ROOT}/crypto/peerOrganizations/gnk.aperam.com/users/Admin@gnk.aperam.com/msp
ORG1_TLS_ROOTCERT_FILE=${CONFIG_ROOT}/crypto/peerOrganizations/gnk.aperam.com/peers/peer0.gnk.aperam.com/tls/ca.crt
ORG2_MSPCONFIGPATH=${CONFIG_ROOT}/crypto/peerOrganizations/corp.aperam.com/users/Admin@corp.aperam.com/msp
ORG2_TLS_ROOTCERT_FILE=${CONFIG_ROOT}/crypto/peerOrganizations/corp.aperam.com/peers/peer0.corp.aperam.com/tls/ca.crt
ORDERER_TLS_ROOTCERT_FILE=${CONFIG_ROOT}/crypto/ordererOrganizations/aperam.com/orderers/orderer.aperam.com/msp/tlscacerts/tlsca.aperam.com-cert.pem
set -x

echo "Installing smart contract on peer0.gnk.aperam.com"
docker exec \
  -e CORE_PEER_LOCALMSPID=GnkMSP \
  -e CORE_PEER_ADDRESS=peer0.gnk.aperam.com:7051 \
  -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
  -e CORE_PEER_TLS_ROOTCERT_FILE=${ORG1_TLS_ROOTCERT_FILE} \
  cli \
  peer chaincode install \
    -n fabcar \
    -v 1.0 \
    -p "$CC_SRC_PATH" \
    -l "$CC_RUNTIME_LANGUAGE"

echo "Installing smart contract on peer0.corp.aperam.com"
docker exec \
  -e CORE_PEER_LOCALMSPID=CorpMSP \
  -e CORE_PEER_ADDRESS=peer0.corp.aperam.com:9051 \
  -e CORE_PEER_MSPCONFIGPATH=${ORG2_MSPCONFIGPATH} \
  -e CORE_PEER_TLS_ROOTCERT_FILE=${ORG2_TLS_ROOTCERT_FILE} \
  cli \
  peer chaincode install \
    -n fabcar \
    -v 1.0 \
    -p "$CC_SRC_PATH" \
    -l "$CC_RUNTIME_LANGUAGE"

echo "Instantiating smart contract on aperamchannel (mychannel)"
docker exec \
  -e CORE_PEER_LOCALMSPID=GnkMSP \
  -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
  cli \
  peer chaincode instantiate \
    -o orderer.aperam.com:7050 \
    -C aperamchannel \
    -n fabcar \
    -l "$CC_RUNTIME_LANGUAGE" \
    -v 1.0 \
    -c '{"Args":[]}' \
    -P "AND('GnkMSP.member','CorpMSP.member')" \
    --tls \
    --cafile ${ORDERER_TLS_ROOTCERT_FILE} \
    --peerAddresses peer0.gnk.aperam.com:7051 \
    --tlsRootCertFiles ${ORG1_TLS_ROOTCERT_FILE}

echo "Waiting for instantiation request to be committed ..."
sleep 10

echo "Submitting initLedger transaction to smart contract on aperamchannel (mychannel)"
echo "The transaction is sent to the two peers with the chaincode installed (peer0.gnk.aperam.com and peer0.corp.aperam.com) so that chaincode is built before receiving the following requests"
docker exec \
  -e CORE_PEER_LOCALMSPID=Gnk1MSP \
  -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
  cli \
  peer chaincode invoke \
    -o orderer.aperam.com:7050 \
    -C aperamchannel \
    -n fabcar \
    -c '{"function":"initLedger","Args":[]}' \
    --waitForEvent \
    --tls \
    --cafile ${ORDERER_TLS_ROOTCERT_FILE} \
    --peerAddresses peer0.gnk.aperam.com:7051 \
    --peerAddresses peer0.corp.aperam.com:9051 \
    --tlsRootCertFiles ${ORG1_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG2_TLS_ROOTCERT_FILE}
set +x