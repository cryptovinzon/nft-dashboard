const contract = '0x9e0d99b864e1ac12565125c5a82b59adea5a09cd';
let sales = [];
let listings = [];
let displayNumber = 6;
let prices = []
const ETHCollections = [
    {
    name: 'Legends of Venari',
    slug: 'legends-of-venari-pass'
    },
    {
    name: 'Legends of Venari Alpha',
    slug: 'legends-of-venari-alpha-pass'
    },
    {
    name: 'Chumbi Valley',
    slug: 'chumbivalleyofficial'
    },
    {
        name: 'Sipher Neko',
        slug: 'sipherianflash'
    },
    {
        name: 'Sipher Surge',
        slug: 'sipheriansurge'
    }
]

const getPrices = async() => {    
    const response  = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=[%22BTCUSDT%22,%22ETHUSDT%22,%22SOLUSDT%22,%22ILVUSDT%22,%22MATICUSDT%22]');

    if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	    }
    
    prices = await response.json();        
}

function showPrices(array) {
    let container = document.querySelector('.price-container');
    for (i=0; i < array.length; i++) {
        let priceDiv = document.createElement('div');
        priceDiv.textContent = `${Math.round(array[i].price).toLocaleString()} ${array[i].symbol}`;
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
    const dailyVolume = data.stats.one_day_sales

    div.textContent = `${name}: ${floorPrice} ETH ${USDTPrice} USDT | 24H sales: ${dailyVolume}`;
    floorContainer.appendChild(a).appendChild(div);
}

function getListings(contract) {
    fetch(`https://api.x.immutable.com/v1/orders?page_size=50&sell_token_address=${contract}&include_fees=true&status=active`)
    .then(response => response.json())
    .then(data => listings = data)
    .then(() => displayListings(listings));
}

function getSales(contract) {
    fetch(`https://api.x.immutable.com/v1/orders?buy_token_address=${contract}&status=filled`)
    .then(response => response.json())
    .then(data => sales = data)
    .then(() => displaySales(sales))
    .then(() => getVolume())
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
    showSalesSummary();
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

function showSalesSummary() {
    let container = document.querySelector('.sales-summary');

    for (i=0; i < 20; i++){
        let nameDiv = document.createElement('td');
        let priceDiv = document.createElement('td');
        let currencyDiv = document.createElement('td');
        let timeDiv = document.createElement('td');

        let name = sales.result[i].buy.data.properties.name;
        let price = sales.result[i].sell.data.quantity_with_fees/(10**(sales.result[i].sell.data.decimals));
        let currency = sales.result[i].sell.type;
        let time = getMinutesAgo(sales, i);

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

const getSortedLand = async(tier) => {
    let encoded = encodeURI(`{"tier":["${tier}"]}`)
    const response = await fetch(`https://api.x.immutable.com/v1/orders?page_size=200&sell_token_address=0x9e0d99b864e1ac12565125c5a82b59adea5a09cd&include_fees=true&status=active&buy_token_type=ETH&order_by=buy_quantity_with_fees&direction=asc&sell_metadata=${encoded}`)
    if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	    }
    
    return await response.json();        
}

function getFloor(sortedLand, tier) {    
    let floorHeader = document.querySelector(`.floor${tier}`);
    let ETHfloor = sortedLand.result[0].buy.data.quantity/10**sortedLand.result[0].buy.data.decimals;
    let floorInUSDT = Math.round(ETHfloor * prices[1].price);

    floorHeader.textContent += ` (${ETHfloor} ETH ${floorInUSDT} USDT)`
}

function getVolume() {
    let dailyVolume = sales.result.filter(item => new Date().getTime() - new Date(item.timestamp).getTime() < (24*60*60*1000));
    document.querySelector('.sales-header').textContent += ` | 24h Vol: ${dailyVolume.length}`    
}

function getRegionData(sortedLand, tier) {   
    const regions = [
        'Abyssal Basin',
        'Brightland Steppes',
        'Crimson Waste',
        'Crystal Shores',
        'Halcyon Sea',
        'Shardbluff Labyrinth',
        'Taiga Boreal'    
    ]

    regions.forEach(region => {
        let regionData = {
            name: region, 
            firstFloor: '',
            secondFloor: '',
            count: ''
        }

        let priceRanges = {
            tier1: {
                small: 0.4,
                large: 0.5
            },
            tier2: {
                small: 1.25,
                large: 1.35
            }
        }

        let filtered = sortedLand.result.filter(obj => obj.sell.data.properties.name.includes(region)); 

        regionData.firstFloor = filtered[0]
        regionData.secondFloor = filtered[1]

        regionData.count = filtered.reduce((acc, i) => {
            switch(tier) {
                case 1:
                    if (i.buy.data.quantity/10**i.buy.data.decimals < priceRanges.tier1.small) {
                        acc.small += 1;
                    } else if (i.buy.data.quantity/10**i.buy.data.decimals >= priceRanges.tier1.small && i.buy.data.quantity/10**i.buy.data.decimals < priceRanges.tier1.large) {
                        acc.med += 1;
                    } else if (i.buy.data.quantity/10**i.buy.data.decimals >= priceRanges.tier1.large) {
                        acc.large += 1;
                    }
                    return acc;
                    break;
                case 2:
                    if (i.buy.data.quantity/10**i.buy.data.decimals < priceRanges.tier2.small) {
                        acc.small += 1;
                    } else if (i.buy.data.quantity/10**i.buy.data.decimals >= priceRanges.tier2.small && i.buy.data.quantity/10**i.buy.data.decimals < priceRanges.tier2.large) {
                        acc.med += 1;
                    } else if (i.buy.data.quantity/10**i.buy.data.decimals >= priceRanges.tier2.large) {
                        acc.large += 1;
                    }
                    return acc;
            }

        }, {small:0, med:0, large:0})
        displayRegionData(regionData, tier)
    })    
}

function displayRegionData(region, tier) {
    let landFloorContainer = document.querySelector(`.tier${tier}`);
    let areaFloorContainer = document.createElement('div')
    let regionDiv = document.createElement('span');
    let floorOneDiv = document.createElement('div');
    let floorOneLink = document.createElement('a')
    let floorTwoDiv = document.createElement('div');
    let floorTwoLink = document.createElement('a');
    let differenceDiv = document.createElement('span');
    let countSmallDiv = document.createElement('div')
    let countMedDiv = document.createElement('div')
    let countLargeDiv = document.createElement('div')
    
    floorOneLink.href = `https://illuvidex.illuvium.io/asset/0x9e0d99b864e1ac12565125c5a82b59adea5a09cd/${region.firstFloor.sell.data.token_id}`;
    floorTwoLink.href = `https://illuvidex.illuvium.io/asset/0x9e0d99b864e1ac12565125c5a82b59adea5a09cd/${region.secondFloor.sell.data.token_id}`;
    floorOneLink.setAttribute('target', '_blank')
    floorTwoLink.setAttribute('target', '_blank')

    let priceOne = region.firstFloor.buy.data.quantity/10**region.firstFloor.buy.data.decimals;
    let priceTwo = region.secondFloor.buy.data.quantity/10**region.secondFloor.buy.data.decimals;
    let difference = Math.round((priceTwo - priceOne)*100)/100;

    difference > 0.03? differenceDiv.classList.add('profit') : undefined;

    regionDiv.textContent = region.name;
    floorOneDiv.textContent = `${priceOne.toFixed(4)}`;
    floorTwoDiv.textContent = `${priceTwo.toFixed(4)}`;
    differenceDiv.textContent = `\u25B3 ${difference}`;
    countSmallDiv.textContent = `${region.count.small}`
    countMedDiv.textContent = `${region.count.med}`
    countLargeDiv.textContent = `${region.count.large}`

    areaFloorContainer.classList.add('area-floor-container');

    landFloorContainer.appendChild(areaFloorContainer).append(regionDiv, floorOneLink, floorTwoLink, differenceDiv, countSmallDiv, countMedDiv, countLargeDiv);
    floorOneLink.appendChild(floorOneDiv);
    floorTwoLink.appendChild(floorTwoDiv);
}

const run = async() => {        
    await getPrices();
    showPrices(prices)

    await ETHCollections.forEach(collection => getOpenseaData(collection));

    const tier1Sorted = await getSortedLand(1);
    getFloor(tier1Sorted, 1)
    getRegionData(tier1Sorted, 1)

    const tier2Sorted = await getSortedLand(2);
    getFloor(tier2Sorted, 2)
    getRegionData(tier2Sorted, 2)

    getListings(contract);
    getSales(contract);
}

run()
