import { assert } from  'chai'; 
import mysql from 'mysql';
import {Scraper} from 'app/lib/Infrastructure/Scraper';
import {ProductStorageMysql} from 'app/lib/Infrastructure/ProductStorageMysql';
import { Product } from  'app/lib/Model/Product/Product';

const config = require('app/config/config');


let productScraper = new Scraper(
  config.scraper.fistPageUrl,
  config.scraper.pageUrlPagination,
  1
);

let connection = mysql.createConnection(config.db);


describe('Scraper', function() {
   describe('#scrapeAll()', function() {

    before(async function() {
        await productScraper.scrapeAll();
    });
     
    it('should populate products array', function() {
      assert.isAbove(productScraper.products.length, 0);
    });

    it('products[0]product.id should not be empty', function() {
      assert.isAbove(productScraper.products[0].id, 0);
    });

    it('products[0]product.name should not be empty', function() {
        assert.isAbove(productScraper.products[0].name.length, 0);
    });

    it('products[0]product.brand should not be empty', function() {
        assert.isAbove(productScraper.products[0].brand.length, 0);
    });
    
  });

});


describe('mysql', function() {
  describe('connect()', function() {
  
    it('should connect to db', function(done) {
     
     // assert.equal(connection.state, 'authenticated');
       connection.connect(function(){
        if (connection.state != 'authenticated')
          done(new Error('Error connecting to database'));

        done();
      });
    });
       
 });

});


describe('ProductStorageMysql', function() {
  describe('#list()', function() {

    var productList: any;

    before(async function() {
      //Create db connection
      let productStorage =  new ProductStorageMysql(connection);
      productList = await productStorage.list(0,2);
    

    });
   
    it('should return results', function() {
      assert.isAbove(productList.length, 0);
    });

    it('results product should be instance of Product', function() {
      assert.instanceOf(productList[0], Product);
    });
       
 });

});
