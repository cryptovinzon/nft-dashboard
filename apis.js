function getNFTs() {

const options = {method: 'GET', headers: {Accept: 'application/json', 'X-API-Key': config.SECRET_API_KEY}};

fetch('https://deep-index.moralis.io/api/v2/0xE833029958399948e9BdebcE02c55D64FCE6C781/nft?chain=eth&format=decimal', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
  
}

export {getNFTs};