#!/bin/bash

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo
echo "Build your first network (BYFN) end-to-end test"
echo
CHANNEL_NAME="$1"
DELAY="$2"
LANGUAGE="$3"
TIMEOUT="$4"
VERBOSE="$5"
NO_CHAINCODE="$6"
: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${LANGUAGE:="golang"}
: ${TIMEOUT:="10"}
: ${VERBOSE:="false"}
: ${NO_CHAINCODE:="false"}
LANGUAGE=`echo "$LANGUAGE" | tr [:upper:] [:lower:]`
COUNTER=1
MAX_RETRY=10

CC_SRC_PATH="opt/gopath/src/chain/chaincode_example02/go/"
if [ "$LANGUAGE" = "node" ]; then
	CC_SRC_PATH="/opt/gopath/src/chain/chaincode_example02/node/"
fi

if [ "$LANGUAGE" = "java" ]; then
	CC_SRC_PATH="/opt/gopath/src/chain/chaincode_example02/java/"
fi

echo "Channel name : "$CHANNEL_NAME

# import utils
. scripts/utils.sh

createChannel() {
	echo "===================== Setting globals ===================== "
	setGlobals 0 1
	echo "===================== END Setting globals ===================== "
	if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
        echo "channel creation if"
		set -x
		#peer channel create -o orderer.aperam.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx >&log.txt
		peer channel create -o orderer.aperam.com:7050 -c $CHANNEL_NAME -f /opt/gopath/fabric-samples/aperam/channel-artifacts/channel.tx >&log.txt
		res=$?
    	set +x
	else
		echo "channel creation else"
		set -x
		#peer channel create -o orderer.aperam.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt
		peer channel create -o orderer.aperam.com:7050 -c $CHANNEL_NAME -f /opt/gopath/fabric-samples/aperam/channel-artifacts/channel.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt
		res=$?
		set +x
	fi
	cat log.txt
	verifyResult $res "Channel creation failed"
	echo "===================== Channel '$CHANNEL_NAME' created ===================== "
	echo
}

joinChannel () {
	# for org in 1 2; do
	#     for peer in 0 1; do
	# 	joinChannelWithRetry $peer $org
	# 	echo "===================== peer${peer}.org${org} joined channel '$CHANNEL_NAME' ===================== "
	# 	sleep $DELAY
	# 	echo
	#     done
	# done
	joinChannelWithRetry 0 1
	echo "===================== peer0.gnk joined channel '$CHANNEL_NAME' ===================== "
	sleep $DELAY

	# joinChannelWithRetry 1 1
	# echo "===================== peer1.gnk joined channel '$CHANNEL_NAME' ===================== "
	# sleep $DELAY

	joinChannelWithRetry 0 2
	echo "===================== peer0.corp joined channel '$CHANNEL_NAME' ===================== "
	sleep $DELAY

	# joinChannelWithRetry 1 2
	# echo "===================== peer1.corp joined channel '$CHANNEL_NAME' ===================== "
	# sleep $DELAY
	
}

## Create channel
echo "Creating channel..."
createChannel

## Join all the peers to the channel
echo "Having all peers join the channel..."
joinChannel

## Set the anchor peers for each org in the channel
echo "Updating anchor peers for gnk..."
updateAnchorPeers 0 1
echo "Updating anchor peers for corp..."
updateAnchorPeers 0 2

if [ "${NO_CHAINCODE}" != "true" ]; then

	## Install chaincode on peer0.org1 and peer0.org2
	echo "Installing chaincode on peer0.gnk..."
	installChaincode 0 1
	echo "Install chaincode on peer0.corp..."
	installChaincode 0 2

	# Instantiate chaincode on peer0.org2
	echo "Instantiating chaincode on peer0.corp..."
	instantiateChaincode 0 2

	# Query chaincode on peer0.org1
	echo "Querying chaincode on peer0.gnk..."
	chaincodeQuery 0 1 100

	# Invoke chaincode on peer0.org1 and peer0.org2
	echo "Sending invoke transaction on peer0.org1 peer0.org2..."
	chaincodeInvoke 0 1 0 2
	
	# ## Install chaincode on peer1.org2
	# echo "Installing chaincode on peer1.org2..."
	# installChaincode 1 2

	# # Query on chaincode on peer1.org2, check if the result is 90
	# echo "Querying chaincode on peer1.org2..."
	# chaincodeQuery 1 2 90
	
fi

echo
echo "========= All GOOD, BYFN execution completed =========== "
echo

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo

exit 0
