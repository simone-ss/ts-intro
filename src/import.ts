//import rp from 'request-promise';
//import cheerio from 'cheerio';

const config = require('./config/config');

import mysql from 'mysql';
//import {Product} from  './lib/Model/Product/Product';

import {ProductStorageMysql} from './lib/Infrastructure/ProductStorageMysql';
import {Scraper} from 'app/lib/Infrastructure/Scraper';

//Create db connection
let connection = mysql.createConnection(config.db);
connection.connect();

// Initialize productStorage
let productStorage =  new ProductStorageMysql(connection);
productStorage.list(0,10);

// Initialize productScraper
let productScraper = new Scraper(
    config.scraper.fistPageUrl,
    config.scraper.pageUrlPagination,
    config.scraper.numberOfPage
);



async function importProducts()
{
   await productScraper.scrapeAll();
   console.log( productScraper.products);
   productScraper.products.forEach(product => {
        productStorage.save(product);
   });
}

async function run()
{
    await importProducts();
    connection.end();
}

run();



/*
async function importProducts(url: string) {
    //Define api request url and callback
    const options = {
        uri: url,
        transform: function (body: string) {
            return cheerio.load(body);
        }
      }; 
    //Async api call  
    const $: CheerioStatic = await rp(options);

 
    var products : Product[] = [];
    $('.browsing-product-list figure.browsing-product-item figcaption').each(function(_i,e) {
        let productBrand: string = '';
        let productName: string = '';
        $(e).children().each(function(_j,f) {
            if ($(f).attr('itemprop') == 'brand') {
                productBrand = $(f).text();
            }
            if ($(f).attr('itemprop') == 'name') {
                productName = $(f).text();
            }
        }); 

        let productUrl = $(e).parent().attr('href');
        let urlParts =  productUrl.split('/');
        let productId = parseInt(urlParts[urlParts.length -1]);

        //Create new product
        let p = new Product(productId, productBrand, productName, productUrl);

        //Add the product into DB
       // productStorage.save(p);
        
        products.push(p);
        
    });
}

*/


/*
for (let p = 1; p <= config.scraper.numberOfPage; p++) { 
    if (p == 1) {
        var productsPageUrl = config.scraper.fistPageUrl;
    } else {
        var productsPageUrl = config.scraper.pageUrlPagination + p;
    }
    console.log('Importing page #'+p + 'from url: '+ productsPageUrl);
    importProducts(productsPageUrl);
    console.log(importedProductCount + 'Product imported so far');
}

*/


//connection.end();











// rp(options)
//     .then(function ($: CheerioStatic) {
//         var products : Product[] = [];
//         $('.browsing-product-list figure.browsing-product-item figcaption').each(function(_i,e) {
//             let productBrand: string = '';
//             let productName: string = '';
//             $(e).children().each(function(_j,f) {
//                 if ($(f).attr('itemprop') == 'brand') {
//                     productBrand = $(f).text();
//                 }
//                 if ($(f).attr('itemprop') == 'name') {
//                     productName = $(f).text();
//                 }
//             }); 

//             let productUrl = $(e).parent().attr('href');
//             let urlParts =  productUrl.split('/');
//             let productId = parseInt(urlParts[urlParts.length -1]);


//             //Create new product
//             let p = new Product(productId, productBrand, productName, productUrl);
//             insertProduct(p);
//             products.push(p);
            
//         });
 
//      console.log(products);
//      console.log('done');

//     })
//     .catch(function (_err) {
//         //Log error 
//         console.log('Error fetching data');
//     });
