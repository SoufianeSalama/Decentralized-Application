#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

# function json_ccp {
#     local PP=$(one_line_pem $5)
#     local CP=$(one_line_pem $6)
#     sed -e "s/\${ORG}/$1/" \
#         -e "s/\${P0PORT}/$2/" \
#         -e "s/\${P1PORT}/$3/" \
#         -e "s/\${CAPORT}/$4/" \
#         -e "s#\${PEERPEM}#$PP#" \
#         -e "s#\${CAPEM}#$CP#" \
#         ccp-template.json 
# }

# function yaml_ccp {
#     local PP=$(one_line_pem $5)
#     local CP=$(one_line_pem $6)
#     sed -e "s/\${ORG}/$1/" \
#         -e "s/\${P0PORT}/$2/" \
#         -e "s/\${P1PORT}/$3/" \
#         -e "s/\${CAPORT}/$4/" \
#         -e "s#\${PEERPEM}#$PP#" \
#         -e "s#\${CAPEM}#$CP#" \
#         ccp-template.yaml | sed -e $'s/\\\\n/\\\n        /g'
# }


function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
         -e "s/\${ORGANIZATION}/$6/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.json 
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${ORGANIZATION}/$6/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.yaml | sed -e $'s/\\\\n/\\\n        /g'
}

ORG=gnk
ORGANIZATION=Gnk
P0PORT=7051
#P1PORT=8051
CAPORT=7054
PEERPEM=crypto-config/peerOrganizations/gnk.aperam.com/tlsca/tlsca.gnk.aperam.com-cert.pem
CAPEM=crypto-config/peerOrganizations/gnk.aperam.com/ca/ca.gnk.aperam.com-cert.pem

#echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-gnk.json
#echo "$(yaml_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-gnk.yaml
echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORGANIZATION)" > connection-gnk.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORGANIZATION)" > connection-gnk.yaml

ORG=corp
ORGANIZATION=Corp
P0PORT=9051
#P1PORT=10051
CAPORT=8054
PEERPEM=crypto-config/peerOrganizations/corp.aperam.com/tlsca/tlsca.corp.aperam.com-cert.pem
CAPEM=crypto-config/peerOrganizations/corp.aperam.com/ca/ca.corp.aperam.com-cert.pem

#echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-corp.json
#echo "$(yaml_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-corp.yaml
echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORGANIZATION)" > connection-corp.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $ORGANIZATION)" > connection-corp.yaml
