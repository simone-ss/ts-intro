import express from 'express';
import mysql from 'mysql';
import {ProductStorageMysql} from 'app/lib/Infrastructure/ProductStorageMysql';
import { ProductApi } from 'app/lib/Model/Product/ProductApi';
import { ProductApiResponseInterface } from 'app/lib/Model/Product/ProductApiResponses';

const app = express();
const port = 3000;
const config = require('app/config/config');  //avoid require use import


//Create db connection
let connection = mysql.createConnection(config.db);
connection.connect();

// Initialize productStorage
let productStorage =  new ProductStorageMysql(connection);
let productApi = new ProductApi(productStorage, config.api);



/**
 * GET products
 */
app.get('/products/', (req, res) => {

    //Get page parameter from url
    let page = (isNaN(req.query.page)) ? 1 : parseInt(req.query.page);  
   
    //Exacute the api
    productApi.list(page).then((apiResponse)=>{

        //if(Object.keys(data).length === 0) {
            //Page not found
          //  res.send(404);
            //return;
     //   }

        res.json(apiResponse);
    }).catch(e=>{
        console.log(e);
        res.send(400);
    })

})

/**
 * DELETE product
 */
app.delete('/product/', (req, res) => {

    if (isNaN(req.query.id)) { 
        res.send(404);
        return;
    }
    let productId = req.query.id;
 
    productApi.delete(productId).then( (apiResponse:ProductApiResponseInterface) => {
        res.json(apiResponse);
    }).catch(e=>{
        console.log(e);
        res.send(500);
    })
})


app.listen(port, () => {
  console.log(`server is listening`+port);
})
