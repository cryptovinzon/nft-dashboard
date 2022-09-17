/*
WALLET OWNED NFTS
let headers = {
    "Access-Control-Allow-Headers" : "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
}

function getNFTs() {
    const options = {method: 'GET', headers: {Accept: 'application/json', 'X-API-Key': config.SECRET_API_KEY}};
    fetch('https://deep-index.moralis.io/api/v2/0xE833029958399948e9BdebcE02c55D64FCE6C781/nft?chain=eth&format=decimal', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));      
    }


MAGIC EDEN
function getMagicEdenData(collection) {
    fetch(`https://api-mainnet.magiceden.dev/v2/collections/${collection}/stats`)
    .then((response) => response.json())
    .then((data) => console.log(data))
}

function showMEFloor(name, data){
    let floorContainer = document.querySelector('.floor-price-container');
    let div = document.createElement('div');

    div.textContent = `${name} ${data.floorPrice}`;
    floorContainer.append(div);
}

//getMagicEdenData('aurory')
*/
