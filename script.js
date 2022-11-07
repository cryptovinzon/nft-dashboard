const contract = '0x9e0d99b864e1ac12565125c5a82b59adea5a09cd';
let sales = [];
let listings = [];
let displayNumber = 6;
let prices = []
const ETHCollections = [
    {
    name : "Legends of Venari",
    slug : "legends-of-venari-pass"
    },
    {
    name : "Legends of Venari Alpha",
    slug : "legends-of-venari-alpha-pass"
    },
    {
    name : "Chumbi Valley",
    slug : "chumbivalleyofficial"
    }
]

let sortedLand = [];
const regions = [
    'Abyssal Basin',
    'Brightland Steppes',
    'Crimson Waste',
    'Crystal Shores',
    'Halcyon Sea',
    'Shardbluff Labyrinth',
    'Taiga Boreal'    
]

const getPrices = async() => {    
    const response  = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=[%22BTCUSDT%22,%22ETHUSDT%22,%22ILVUSDT%22,%22MATICUSDT%22]');

    if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	    }
    
    prices = await response.json();        
}

function showPrices(array) {
    let container = document.querySelector('.price-container');
    for (i=0; i < array.length; i++) {
        let priceDiv = document.createElement('div');
        priceDiv.textContent = `$${Math.round(array[i].price).toLocaleString("en-US")} ${array[i].symbol}`;
        container.appendChild(priceDiv);
    }
}

const getOpenseaData = async(collection) => {
    const response = await fetch(`https://api.opensea.io/api/v1/collection/${collection.slug}/stats`);

    if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	    }
    
    data = await response.json();    
    showOSFloor(collection, data);
}

function showOSFloor(collection, data){
    let floorContainer = document.querySelector('.floor-price-container');
    let div = document.createElement('div');
    let a = document.createElement('a');
    a.href = `https://opensea.io/collection/${collection.slug}`;

    const name = collection.name;
    const floorPrice = data.stats.floor_price;
    const USDTPrice = Math.round(floorPrice * prices[1].price);

    div.textContent = `${name}: ${floorPrice} ETH ${USDTPrice} USDT`;
    floorContainer.appendChild(a).appendChild(div);
}

function getListings(contract) {
    fetch(`https://api.x.immutable.com/v1/orders?sell_token_address=${contract}&include_fees=true&status=active`)
    .then(response => response.json())
    .then(data => listings = data)
    .then(() => displayListings(listings));
}

function getSales(contract) {
    fetch(`https://api.x.immutable.com/v1/orders?buy_token_address=${contract}`)
    .then(response => response.json())
    .then(data => sales = data)
    .then(() => {displaySales(sales);
    });
}

function displayListings(listings) {
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

    for (i=0; i < 20; i++){
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

function getSortedLand(contract, token) {
    fetch(`https://api.x.immutable.com/v1/orders?sell_token_address=${contract}&include_fees=true&status=active&buy_token_type=${token}&order_by=buy_quantity_with_fees&direction=asc`)
    .then(response => response.json())
    .then(data => sortedLand = data.result)
    .then(() => getAllFloors(regions))
}

function getAllFloors(regions) {
    // show current floor
    let floorHeader = document.querySelector('.floor');
    floorHeader.textContent += ` (${sortedLand[0].buy.data.quantity/10**sortedLand[0].buy.data.decimals} ETH)`

    for (let i = 0 ; i < regions.length; i++) {
        getFloorPrice(regions[i])
    }
}
/*
function getDailyVolume() {
    let salesResult = sales.result;
    let filtered = salesResult.filter((obj) => {
        return new Date(obj.timestamp) > new Date() - 60 * 60 * 24 * 1000;
    });
    return filtered.length;
}
*/

function getFloorPrice(region){
    let filtered = sortedLand.filter(obj => obj.sell.data.properties.name.includes(region));    
    displayLandFloor(region, filtered[0], filtered[1])
    //displayLandCount(filtered);
    //displayAreaListings(region, filtered);
}

function displayLandFloor(region, firstFloor, secondFloor) {
    let landFloorContainer = document.querySelector('.land-floor-container');
    let areaFloorContainer = document.createElement('div')
    let regionDiv = document.createElement('span');
    let floorOneDiv = document.createElement('div');
    let floorOneLink = document.createElement('a')
    let floorTwoDiv = document.createElement('div');
    let floorTwoLink = document.createElement('a');
    let differenceDiv = document.createElement('span');
    
    floorOneLink.href = `https://illuvidex.illuvium.io/asset/0x9e0d99b864e1ac12565125c5a82b59adea5a09cd/${firstFloor.sell.data.token_id}`;
    floorTwoLink.href = `https://illuvidex.illuvium.io/asset/0x9e0d99b864e1ac12565125c5a82b59adea5a09cd/${secondFloor.sell.data.token_id}`;
    floorOneLink.setAttribute('target', '_blank')
    floorTwoLink.setAttribute('target', '_blank')

    let priceOne = firstFloor.buy.data.quantity/10**firstFloor.buy.data.decimals;
    let priceTwo = secondFloor.buy.data.quantity/10**secondFloor.buy.data.decimals;
    let difference = Math.round((priceTwo - priceOne)*100)/100;

    difference > 0.02? differenceDiv.classList.add('profit') : undefined;

    regionDiv.textContent = region;
    floorOneDiv.textContent = `${priceOne}`;
    floorTwoDiv.textContent = `${priceTwo}`;
    differenceDiv.textContent = `\u25B3 ${difference}`;

    areaFloorContainer.classList.add('area-floor-container');

    landFloorContainer.appendChild(areaFloorContainer).append(regionDiv, floorOneLink, floorTwoLink, differenceDiv);
    floorOneLink.appendChild(floorOneDiv);
    floorTwoLink.appendChild(floorTwoDiv);
}

const getAuroryStats = async() => {
    // const URL = 'https://api-mainnet.magiceden.dev/v2';
    // const collection = 'aurory'
    // const response = await fetch(`${URL}/collections/${collection}/stats`);

    /*
    const response = await fetch('https://marketplace-api.live.aurory.io/v1/programs/marketplace/listings')
    if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	    }

    const data = await response.json();
    console.log(data);
    */
}

/*
function displayLandCount(array) {
    let ETHRanges = [0.4, 0.45, 0.5, 0.6, 0.7];
    let regionCounts = []
    // < first case
    regionCounts.push(array.reduce((acc, obj) => {
        if (obj.buy.data.quantity/10**obj.buy.data.decimals < ETHRanges[0]) {
            return acc + 1;
            };
            return acc;
    }, 0));

    for (let i = 0; i < ETHRanges.length - 1; i++){
        count = array.reduce((acc, obj) => {
            if (obj.buy.data.quantity/10**obj.buy.data.decimals >= ETHRanges[i] && obj.buy.data.quantity/10**obj.buy.data.decimals < ETHRanges[i + 1]) {
            return acc + 1;
            };
            return acc;
        }, 0)
        regionCounts.push(count);
    }
    console.log(regionCounts);
}
*/
const run = async() => {
    await getPrices();
    await ETHCollections.forEach(collection => getOpenseaData(collection));
    // await getAuroryStats();
    showPrices(prices)
    getSales(contract);
    getListings(contract);
    getSortedLand(contract, 'ETH');
}

run()
