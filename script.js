let contract = '0x9e0d99b864e1ac12565125c5a82b59adea5a09cd';
let sales = [];
let listings = [];
let displayNumber = 12;
const token = config.SECRET_API_KEY;

// TODO: loop collection data & displayFloor
function getOpenseaData(collection) {
fetch(`https://api.opensea.io/api/v1/collection/${collection}/stats`)
    .then(response => response.json())
    .then((data) => showOSFloor(collection, data));
}

function showOSFloor(name, data){
    let floorContainer = document.querySelector('.floor-price-container');
    let div = document.createElement('div');

    div.textContent = `${name} ${data.stats.floor_price}`;
    floorContainer.append(div);
}

/*
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
*/

function getSales(contract) {
    fetch(`https://api.x.immutable.com/v1/orders?buy_token_address=${contract}`)
    .then(response => response.json())
    .then(data => sales = data) // store into global array
    .then(() => displaySales(sales));
}

function getListings(contract) {
    fetch(`https://api.x.immutable.com/v1/orders?include_fees=true&status=active&sell_token_address=${contract}`)
    .then(response => response.json())
    .then(data => listings = data) // store into global array
    .then(() => displayListings(listings));
}

function displayListings(listings){
    let listingsContainer = document.querySelector('.recent-listings');
    for (i=0; i < displayNumber; i++) {
        let div = document.createElement('div');
        let img = document.createElement('img');
        let a = document.createElement('a');

        a.href = `https://illuvidex.illuvium.io/asset/0x9e0d99b864e1ac12565125c5a82b59adea5a09cd/${listings.result[i].sell.data.token_id}`;

        div.classList.add('item-container');

        img.src = listings.result[i].sell.data.properties.image_url;

        let name = listings.result[i].sell.data.properties.name
        let price = listings.result[i].buy.data.quantity/(10**(listings.result[i].buy.data.decimals))
        let currency = listings.result[i].buy.type
        let time = getMinutesAgo(listings, i);

        div.textContent = `${name} ${price} ${currency} ${time}`;

        listingsContainer.appendChild(a).appendChild(div).appendChild(img);                               
    }
    showListingSummary();      
}

function displaySales(sales){
    let salesContainer = document.querySelector('.recent-sales');
    for (i=0; i < displayNumber; i++) {
        let div = document.createElement('div');
        let img = document.createElement('img');
        let a = document.createElement('a');
        a.href = `https://illuvidex.illuvium.io/asset/0x9e0d99b864e1ac12565125c5a82b59adea5a09cd/${sales.result[i].buy.data.token_id}`;

        div.classList.add('item-container');

        img.src = sales.result[i].buy.data.properties.image_url;

        let name = sales.result[i].buy.data.properties.name;
        let price = sales.result[i].sell.data.quantity_with_fees/(10**(sales.result[i].sell.data.decimals));
        let currency = sales.result[i].sell.type;
        // let usdPrice = (currency == 'ETH') ? `($${Math.round(price * priceArray[1].price)} US)` : '';
        let time = getMinutesAgo(sales, i);

        div.textContent = `${name} ${price} ${currency} ${time}`;

        salesContainer.appendChild(a).appendChild(div).appendChild(img);                               
    }      
}

function showListingSummary() {
    let container = document.querySelector('.listing-summary');
    //container.createTHead();

    for (i=0; i < 25; i++){
        let nameDiv = document.createElement('td');
        let priceDiv = document.createElement('td');
        let currencyDiv = document.createElement('td');
        let timeDiv = document.createElement('td');

        let name = listings.result[i].sell.data.properties.name;
        let price = listings.result[i].buy.data.quantity/(10**listings.result[i].buy.data.decimals);
        let currency = listings.result[i].buy.type;
        let time = getMinutesAgo(listings, i);

        nameDiv.textContent = name;
        priceDiv.textContent = price;
        currencyDiv.textContent = currency;
        timeDiv.textContent = time;

        container.append(nameDiv, priceDiv, currencyDiv, timeDiv);
    }
}

function getMinutesAgo(array, index) {
    let currentTime = new Date();
    let listTime = new Date (array.result[index].timestamp);
    if (Math.round((currentTime - listTime)/(1000 * 60)) < 60) {
        return Math.round((currentTime - listTime)/(1000 * 60)) + ' min ago';
    } else {
        return Math.round((currentTime - listTime)/(1000 * 60)/60) + ' h ago';
    }    
}

function getPrices() {    
    prices = fetch('https://api.binance.com/api/v3/ticker/price?symbols=[%22BTCUSDT%22,%22ETHUSDT%22,%22ILVUSDT%22]')
        .then(response => response.json())
        .then(data => showPrices(data))        
}

function showPrices(array) {
    let container = document.querySelector('.price-container');
    for (i=0; i < array.length; i++) {
        let priceDiv = document.createElement('div');
        priceDiv.textContent = `$${Math.round(array[i].price).toLocaleString("en-US")} ${array[i].symbol}`;
        container.appendChild(priceDiv);
    }
}

// try put these as constructors?
getPrices();
getSales(contract);
getListings(contract);
getOpenseaData('legends-of-venari-pass');
// getMagicEdenData('aurory');
