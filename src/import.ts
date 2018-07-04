import rp from 'request-promise';
import cheerio from 'cheerio';

const config = require('./config/config');

import mysql, { Query } from 'mysql';
import {Product} from  './lib/Model/Product/Product';

//import {ProductStorageMysql} from '.app/lib/Infrastructure/ProductStorageMysql';
import {ProductStorageMysql} from './lib/Infrastructure/ProductStorageMysql';


//Create connection and connect
let connection = mysql.createConnection(config.db);
connection.connect();
let importedProductCount = 0;





let productStorage = new ProductStorageMysql(connection);
console.log('List=====> ', productStorage.list(0,10));







/**
 * Inser the product into the database
 * 
 * @param p : Product
 */
async function insertProductIntoDB(p:Product) {

        var sql = "INSERT INTO product (id, name, brand, url, timestamp_added) VALUES ?";
        var dateTime = new Date();
        var timeNow = dateTime.getFullYear()+'-'+dateTime.getMonth()+'-'+dateTime.getDay()+' '+dateTime.getHours()+':'+dateTime.getMinutes();
        var values = [
          [p.id, p.name, p.brand, p.url,  timeNow]
        ];
       var _x : Query  =  await connection.query(sql, [values], function (_err, result) {
          if (_err) {
            //console.log(_err);
            return 0;
          } else {
            importedProductCount = importedProductCount + result.affectedRows;
           
         //   console.log(p.id + 'in');
            return result.affectedRows;
          }
        });

        
       // console.log(p, 'out');
        return _x;
} 







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
        insertProductIntoDB(p);
        products.push(p);
        
    });



}



const pageToScrape = 1;
const fistPageUrl : string = 'https://www.ssense.com/en-us/men';
const pageUrlPagination: string = 'https://www.ssense.com/en-us/men?page=';
for (let p = 1; p <= pageToScrape; p++) { 
    if (p == 1) {
        var productsPageUrl = fistPageUrl;
    } else {
        var productsPageUrl = pageUrlPagination + p;
    }
    console.log('Importing page #'+p + 'from url: '+ productsPageUrl);
    importProducts(productsPageUrl);
    console.log(importedProductCount + 'Product imported so far');
}



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
