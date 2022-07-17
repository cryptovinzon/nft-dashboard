let address = document.getElementById('address').value
let contract = document.getElementById('contract').value
let sales = [];
let listings = [];
let displayNumber = 12

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
        let time = getMinutesAgo(listings, i);

        a.href = `https://illuvidex.illuvium.io/asset/0x9e0d99b864e1ac12565125c5a82b59adea5a09cd/${listings.result[i].sell.data.token_id}`;

        div.classList.add('item-container');

        img.src = listings.result[i].sell.data.properties.image_url;
        div.textContent = 
            `${listings.result[i].sell.data.properties.name}
            ${listings.result[i].buy.data.quantity/(10**(listings.result[i].buy.data.decimals))}
            ${listings.result[i].buy.type} ${time}`;

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
        let time = getMinutesAgo(sales, i)
        a.href = `https://illuvidex.illuvium.io/asset/0x9e0d99b864e1ac12565125c5a82b59adea5a09cd/${sales.result[i].buy.data.token_id}`;

        div.classList.add('item-container');

        img.src = sales.result[i].buy.data.properties.image_url;
        div.textContent = 
            `${sales.result[i].buy.data.properties.name}
            ${sales.result[i].sell.data.quantity_with_fees/(10**(sales.result[i].sell.data.decimals))}
            ${sales.result[i].sell.type} ${time}`;

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

// learn to return into div without storying in array
function getPrices() {
    bannerDiv = document.querySelector('.banner');
    prices = fetch('https://api.binance.com/api/v3/ticker/price?symbols=[%22BTCUSDT%22,%22ETHUSDT%22]')
        .then(response => response.json())
        .then(data =>console.log(data))
}

getSales(contract);
getListings(contract);

/* pull out properties (deconstruct)
const { result } = listings
const {address: {city}} = person
*/