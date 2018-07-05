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

