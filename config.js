const SC_ADDRESS = '0xC8e27e7CC8EC21A0CE6921148Ab2EcC9E3536233';  //Testnet MP Address
const SC_ABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "lister",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "tokenOwner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "itemId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "reserveTokenPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "buyoutTokenPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum IMarketplace.ListingType",
                        "name": "listingType",
                        "type": "uint8"
                    }
                ],
                "indexed": false,
                "internalType": "struct IMarketplace.MarketItem",
                "name": "newItem",
                "type": "tuple"
            }
        ],
        "name": "EventName",
        "type": "event"
    }
]

module.exports = {
    SC_ADDRESS,
    SC_ABI
}
