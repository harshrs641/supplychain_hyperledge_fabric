# Hyperledger Fabric Gold Supply Chain

Gold Supply Chain is a network to connect participants across the gold supply industry through a permissioned and private record of gold data. 


## Appendix
- Hyperledger Org: https://www.hyperledger.org/
- Hyperledger Intro: https://hyperledger-fabric.readthedocs.io/en/latest/whatis.html
- Hyperledger GitHub: https://github.com/hyperledger/fabric
- Hyperledger Wiki: https://wiki.hyperledger.org/display/fabric
- Hyperledger Explorer: https://github.com/hyperledger/blockchain-explorer
- What is Private Data: https://hyperledger-fabric.readthedocs.io/en/release-2.2/private-data/private-data.html
- Using Private Data in Fabric: https://hyperledger-fabric.readthedocs.io/en/release-2.2/private_data_tutorial.html
- Writing your first Chaincode: https://hyperledger-fabric.readthedocs.io/en/release-2.2/chaincode4ade.html
- Graphana: https://grafana.com/grafana/dashboards
- Blockchain Governance Considerations: https://www.blockchain.ae/articles/blockchain-governance-considerations
- Private Data Collections on Hyperledger Fabric: https://github.com/IBM/private-data-collections-on-fabric
- Install NoMachine on Ubuntu: https://kifarunix.com/install-nomachine-on-ubuntu/
- Supply chain proof of concept in Hyperledger Fabric: https://github.com/ialberquilla/hlf1.4-supply-chain

## Interesting Links
- [IBM Food Trust](https://www.ibm.com/blockchain/solutions/food-trust)
- [Fair Trade International](https://www.fairtrade.net/)
- [Hyperledger Food Supply Chain dApp](https://rapchan.gitbook.io/hyperledger-food-supply-chain/implementation/deploy-run-dapp)
- [Local CouchDB](http://127.0.0.1:5984/_utils/#login)

## Pull Docker Images

```
harshrajsingh@Harshs-MacBook-Pro fabric-network % ./install-fabric.sh
```



## Create channel and deploy chaincode
```
harshrajsingh@Harshs-MacBook-Pro fabric-network % ./network.sh down  
harshrajsingh@Harshs-MacBook-Pro fabric-network % ./network.sh up createChannel -ca -s couchdb   
harshrajsingh@Harshs-MacBook-Pro fabric-network % ./network.sh deployCC -ccn supplychain -ccp ../../chaincode -ccl typescript

```




## Create wallets for admin, manager, employee and client to authorize apis
```
harshrajsingh@Harshs-MacBook-Pro fabric % rm -R wallet/*
harshrajsingh@Harshs-MacBook-Pro fabric % node '/Users/harshrajsingh/GitHub/hyperledger-gold-supply-chain/web-app/server/fabric/enrollAdmin.js'
harshrajsingh@Harshs-MacBook-Pro fabric % node '/Users/harshrajsingh/GitHub/hyperledger-gold-supply-chain/web-app/server/fabric/registerUsers.js'

```



## Start API server
```
harshrajsingh@Harshs-MacBook-Pro server % node '/Users/harshrajsingh/GitHub/hyperledger-gold-supply-chain/web-app/server/app.js'

```