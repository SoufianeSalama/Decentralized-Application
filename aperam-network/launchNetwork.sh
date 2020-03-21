#!/bin/bash
#
# Script for launching the Hyperledger Fabric network (located in fabric_network)
# By Soufiane Salama
# For Fabric version 1.4.4
# based on byfn.sh (Building Your First Network) example script
# 

export PATH=${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
export VERBOSE=false


# Obtain the OS and Architecture string that will be used to select the correct
# native binaries for your platform, e.g., darwin-amd64 or linux-amd64
OS_ARCH=$(echo "$(uname -s | tr '[:upper:]' '[:lower:]' | sed 's/mingw64_nt.*/windows/')-$(uname -m | sed 's/x86_64/amd64/g')" | awk '{print tolower($0)}')
# timeout duration - the duration the CLI should wait for a response from
# another container before giving up
CLI_TIMEOUT=10
# default for delay between commands
CLI_DELAY=3
# system channel name defaults to "aperam-sys-channel"
SYS_CHANNEL="aperam-sys-channel"

# channel name defaults to "mychannel"
CHANNEL_NAME="aperamchannel"

# use this as the default docker-compose yaml definition
COMPOSE_FILE=docker-compose-cli.yaml
COMPOSE_FILE_COUCH=docker-compose-couch.yaml
COMPOSE_FILE_CA=docker-compose-ca.yaml

# use node as the default language for chaincode
LANGUAGE=node
# default image tag
IMAGETAG="latest"
# default consensus type
CONSENSUS_TYPE="solo"

NO_CHAINCODE=true
#NO_CHAINCODE=false





function checkPrereqs() {
  # Note, we check configtxlator externally because it does not require a config file, and peer in the
  # docker image because of FAB-8551 that makes configtxlator return 'development version' in docker
  LOCAL_VERSION=$(configtxlator version | sed -ne 's/ Version: //p')
  DOCKER_IMAGE_VERSION=$(docker run --rm hyperledger/fabric-tools:$IMAGETAG peer version | sed -ne 's/ Version: //p' | head -1)

  echo "LOCAL_VERSION=$LOCAL_VERSION"
  echo "DOCKER_IMAGE_VERSION=$DOCKER_IMAGE_VERSION"

  if [ "$LOCAL_VERSION" != "$DOCKER_IMAGE_VERSION" ]; then
    echo "=================== WARNING ==================="
    echo "  Local fabric binaries and docker images are  "
    echo "  out of  sync. This may cause problems.       "
    echo "==============================================="
  fi

  for UNSUPPORTED_VERSION in $BLACKLISTED_VERSIONS; do
    echo "$LOCAL_VERSION" | grep -q $UNSUPPORTED_VERSION
    if [ $? -eq 0 ]; then
      echo "ERROR! Local Fabric binary version of $LOCAL_VERSION does not match this newer version of BYFN and is unsupported. Either move to a later version of Fabric or checkout an earlier version of fabric-samples."
      exit 1
    fi

    echo "$DOCKER_IMAGE_VERSION" | grep -q $UNSUPPORTED_VERSION
    if [ $? -eq 0 ]; then
      echo "ERROR! Fabric Docker image version of $DOCKER_IMAGE_VERSION does not match this newer version of BYFN and is unsupported. Either move to a later version of Fabric or checkout an earlier version of fabric-samples."
      exit 1
    fi
  done
}

# Generates Org certs using cryptogen tool
function generateCerts() {
  which cryptogen
  if [ "$?" -ne 0 ]; then
    echo "cryptogen tool not found. exiting"
    exit 1
  fi
  echo
  echo "##########################################################"
  echo "##### Generate certificates using cryptogen tool #########"
  echo "##########################################################"

  if [ -d "crypto-config" ]; then
    rm -Rf crypto-config
    echo "removed"
  fi
  set -x
  cryptogen generate --config crypto-config.yaml
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate certificates..."
    exit 1
  fi
  echo
  echo "Generate CCP files for Gnk and Corp"
  ./ccp-generate.sh
}


# Generate orderer genesis block, channel configuration transaction and
# anchor peer update transactions
function generateChannelArtifacts() {
  which configtxgen
  if [ "$?" -ne 0 ]; then
    echo "configtxgen tool not found. exiting"
    exit 1
  fi

  echo "##########################################################"
  echo "#########  Generating Orderer Genesis block ##############"
  echo "##########################################################"
  # Note: For some unknown reason (at least for now) the block file can't be
  # named orderer.genesis.block or the orderer will fail to launch!
  echo "CONSENSUS_TYPE="$CONSENSUS_TYPE
  set -x
#   if [ "$CONSENSUS_TYPE" == "solo" ]; then
  configtxgen -profile OrdererGenesis -channelID $SYS_CHANNEL -outputBlock ./channel-artifacts/genesis.block
#   elif [ "$CONSENSUS_TYPE" == "kafka" ]; then
#     configtxgen -profile SampleDevModeKafka -channelID $SYS_CHANNEL -outputBlock ./channel-artifacts/genesis.block
#   elif [ "$CONSENSUS_TYPE" == "etcdraft" ]; then
#     configtxgen -profile SampleMultiNodeEtcdRaft -channelID $SYS_CHANNEL -outputBlock ./channel-artifacts/genesis.block
#   else
#     set +x
#     echo "unrecognized CONSESUS_TYPE='$CONSENSUS_TYPE'. exiting"
#     exit 1
#   fi
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate orderer genesis block..."
    exit 1
  fi
  echo
  echo "#################################################################"
  echo "### Generating channel configuration transaction 'channel.tx' ###"
  echo "#################################################################"
  set -x
  configtxgen -profile AperamChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate channel configuration transaction..."
    exit 1
  fi

  echo
  echo "#################################################################"
  echo "#######    Generating anchor peer update for GnkMSP   ##########"
  echo "#################################################################"
  set -x
  configtxgen -profile AperamChannel -outputAnchorPeersUpdate ./channel-artifacts/GnkMSPanchors.tx -channelID $CHANNEL_NAME -asOrg GnkMSP
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate anchor peer update for GnkMSP..."
    exit 1
  fi

  echo
  echo "#################################################################"
  echo "#######    Generating anchor peer update for CorpMSP   ##########"
  echo "#################################################################"
  set -x
  configtxgen -profile AperamChannel -outputAnchorPeersUpdate ./channel-artifacts/CorpMSPanchors.tx -channelID $CHANNEL_NAME -asOrg CorpMSP
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate anchor peer update for CorpMSP..."
    exit 1
  fi
  echo
}




#### 1. Shutdown network (networkDown())
echo
echo "##########################################################"
echo "#####         Shutting the network down           ########"
echo "##########################################################"

docker-compose -f $COMPOSE_FILE -f $COMPOSE_FILE_COUCH -f $COMPOSE_FILE_CA down --volumes --remove-orphans
#docker-compose -f $COMPOSE_FILE -f $COMPOSE_FILE_COUCH down --volumes --remove-orphans
# Clear docker containers
CONTAINER_IDS=$(docker ps -a | awk '($2 ~ /dev-peer.*/) {print $1}')
if [ -z "$CONTAINER_IDS" -o "$CONTAINER_IDS" == " " ]; then
  echo "---- No containers available for deletion ----"
else
  docker rm -f $CONTAINER_IDS
fi

# Delete docker images
DOCKER_IMAGE_IDS=$(docker images | awk '($1 ~ /dev-peer.*/) {print $3}')
  if [ -z "$DOCKER_IMAGE_IDS" -o "$DOCKER_IMAGE_IDS" == " " ]; then
    echo "---- No images available for deletion ----"
  else
    docker rmi -f $DOCKER_IMAGE_IDS
  fi

# Remove orderer block and other channel configuration transactions and certs
rm -rf channel-artifacts/*.block channel-artifacts/*.tx crypto-config 

### 1. END 

### 2. Starting network (networkUp()) (generateCerts(), replacePrivateKey(), generateChannelArtifacts())
echo
echo "##########################################################"
echo "#####         Starting the network                ########"
echo "##########################################################"

# Check Prereqs (docker version)
checkPrereqs
  # generate artifacts if they don't exist
  if [ ! -d "crypto-config" ]; then
    generateCerts
    #replacePrivateKey
    generateChannelArtifacts
  fi
  COMPOSE_FILES="-f ${COMPOSE_FILE}"
  #if [ "${CERTIFICATE_AUTHORITIES}" == "true" ]; then
    COMPOSE_FILES="${COMPOSE_FILES} -f ${COMPOSE_FILE_CA}"
    export BYFN_CA1_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/gnk.aperam.com/ca && ls *_sk)
    export BYFN_CA2_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/corp.aperam.com/ca && ls *_sk)
 # fi
#   if [ "${CONSENSUS_TYPE}" == "kafka" ]; then
#     COMPOSE_FILES="${COMPOSE_FILES} -f ${COMPOSE_FILE_KAFKA}"
#   elif [ "${CONSENSUS_TYPE}" == "etcdraft" ]; then
#     COMPOSE_FILES="${COMPOSE_FILES} -f ${COMPOSE_FILE_RAFT2}"
#   fi
#   if [ "${IF_COUCHDB}" == "couchdb" ]; then
    COMPOSE_FILES="${COMPOSE_FILES} -f ${COMPOSE_FILE_COUCH}"
#   fi

  IMAGE_TAG=$IMAGETAG docker-compose ${COMPOSE_FILES} up -d 2>&1
  docker ps -a
  if [ $? -ne 0 ]; then
    echo "ERROR !!!! Unable to start network"
    exit 1
  fi

#   if [ "$CONSENSUS_TYPE" == "kafka" ]; then
#     sleep 1
#     echo "Sleeping 10s to allow $CONSENSUS_TYPE cluster to complete booting"
#     sleep 9
#   fi

#   if [ "$CONSENSUS_TYPE" == "etcdraft" ]; then
#     sleep 1
#     echo "Sleeping 15s to allow $CONSENSUS_TYPE cluster to complete booting"
#     sleep 14
#   fi

  # now run the end to end script
  docker exec cli scripts/script.sh $CHANNEL_NAME $CLI_DELAY $LANGUAGE $CLI_TIMEOUT $VERBOSE $NO_CHAINCODE
  if [ $? -ne 0 ]; then
    echo "ERROR !!!! Test failed"
    exit 1
  fi
