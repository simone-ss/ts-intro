import express from 'express';
import mysql from 'mysql';

const app = express();
const port = 3000;
const config = require('app/config/config');  //avoid require use import


import {ProductStorageMysql} from 'app/lib/Infrastructure/ProductStorageMysql';


//Create db connection
let connection = mysql.createConnection(config.db);
connection.connect();

// Initialize productStorage
let productStorage =  new ProductStorageMysql(connection);




/**
 * GET products
 */
app.get('/products/', (req, res) => {

    //Get offset and limit
    let page = (isNaN(req.query.page)) ? 1 : parseInt(req.query.page);  
   
    let limit = page * config.api.itemPerPage
    let offset = limit - config.api.itemPerPage;
  
    productStorage.list(offset, limit).then((data)=>{

        var responseObject = {
            success: true,
            data: data,
         }

        if(Object.keys(data).length === 0) {
            //Page not found
            res.send(404);
        } 

        res.json(responseObject);
    }).catch(e=>{
        console.log(e);
        res.json({success:false});
    })

})

/**
 * DELETE product
 */
app.delete('/product/', (req, res) => {

    if (isNaN(req.query.id)) { 
        res.send(404);
    }
    let productId = req.query.id;
 
    productStorage.delete(productId).then( (data:any) => {

        var responseObject = {
            success: (data.affectedRows > 0)? true:false,
            affectedRows: data.affectedRows,
         }
        res.json(responseObject);
    }).catch(e=>{
        console.log(e);
        res.json({success:false});
    })
})


app.listen(port, () => {
  console.log(`server is listening`+port);
})
