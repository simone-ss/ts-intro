import express from 'express';


const app = express();
const port = 3000;
const config = require('./config/config');  //avoid require use import

import { dbAdapter } from 'app/lib/dbAdapter';
let db = dbAdapter(config.db);

// import mysql from 'mysql';
// import {wrap} from "node-mysql-wrapper";



// Initialize connection
// var connection = mysql.createConnection(config.db);
// let db = wrap(connection);

/**
 * GET products
 */
app.get('/products/', (req, res) => {

    //Get offset and limit
    let page = (isNaN(req.query.page)) ? 1 : parseInt(req.query.page);  
    const itemPerPgae = 20;
    let limit = page * itemPerPgae
    let offset = limit - itemPerPgae;

    //console.log(limit, offset);
    //Get Products paginated
    new Promise(((resolve,reject)=>{
            db.ready(() => {
                db.query("SELECT * FROM `product` ORDER BY timestamp_added DESC LIMIT "+offset+" , "+limit, (error, results) => {
                    if (error) {
                        reject(error);
                    } else { 
                        resolve(results);
                    }
                });
            });
        })).then( (data) => {

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
 
    new Promise(((resolve,_reject)=>{
        db.ready(() => {
            db.table("product").remove(productId, function(results){
                console.log('delete result', results);
                resolve(results);
            });
        });
    })).then( (data) => {

    //    let responseObjecte = {
          //  success: (data.affectedRows > 0)?true:false,
      //  }
     
        res.json(data);
    }).catch(e=>{
        console.log(e);
        res.json({success:false});
    })
})


app.listen(port, () => {
  console.log(`server is listening`+port);
})
