import { assert } from  'chai'; 

import { ProductStorageInmemory } from 'app/lib/Infrastructure/ProductStorageInmemory';
import { Product } from 'app/lib/Model/Product/Product';
import { ProductApi } from 'app/lib/Model/Product/ProductApi';
import {ProductApiListResponse, ProductApiDeleteResponse} from 'app/lib/Model/Product/ProductApiResponses';
import {Scraper} from 'app/lib/Infrastructure/Scraper';
import {readFileSync} from 'fs';
import { ProductStorageResponse } from 'app/lib/Model/Product/ProductStorageResponse';
const config = require('app/config/config');



let productStorage = new ProductStorageInmemory();
let api = new ProductApi(productStorage, config.api);
var testHtml:string = readFileSync( __dirname +'/mockData/product.html', 'utf8');
// Initialize productScraper
let productScraper = new Scraper(
  config.scraper.fistPageUrl,
  config.scraper.pageUrlPagination,
  config.scraper.numberOfPage
);



  
//====================================================================================//
// Scraper: Scrape products
//====================================================================================//
describe('Scraper', function() {
  describe('scrape product', function() {
    before(async function() {
      let c:CheerioStatic = await productScraper.loadHtml(testHtml);
      productScraper.scrapeProducts(c);
    });
    
    it('should scrape products', function() {
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

//====================================================================================//
// Storage: test insert
//====================================================================================//
describe('Storage', function() {
  describe('save', function() {
    
    it('should save correctly', function() {
       productScraper.products.forEach(async function(el){
        let response = await productStorage.save(el);
        assert.instanceOf(response, ProductStorageResponse, 'response type expected: ProductStorageResponse');
        assert.equal(response.status, true, 'Response status must be true');
        assert.equal(response.affectedRows, 1);
       });   
    });
  });
});



describe('Api', function() {
  describe('#list()', function() {
    let productList:any;
    before(async function() {
        productList = await api.list(1);
    });
    
    it('should return an instance ProductApiListResponse', function() {
      assert.instanceOf(productList, ProductApiListResponse);
    });

    it('response should contain products', function() {
      assert.isAbove(productList.data.length, 0);  
      assert.instanceOf(productList.data[0], Product); 
    });

    it('response\'s products should be instance of Product', function() {
      assert.instanceOf(productList.data[0], Product);  
    });
  });


  describe('#delete()', function() {
    var deleteResponse:any;
    var p1: Product;

    before(async function() {
      //Add product inot storage
      p1 = new Product(2598508, 'Blue Striped Shirt', 'Faith Connexion','http://');
      await productStorage.save(p1);

      deleteResponse = await api.delete(p1.id);
   
    });
    
    it('should return an instance of ProductApiDeleteResponse', function() {
      assert.instanceOf(deleteResponse, ProductApiDeleteResponse);
    });

    it('should delete the product', function() {
      assert.equal(deleteResponse.affectedRows, 1);
      assert.equal(deleteResponse.status, true);
    });

    it('should return affectedRows = 0 trying to delete not existent product', async function() {
      let dr = await api.delete(p1.id);
      assert.equal(dr.affectedRows, 0);
      assert.equal(dr.status, true);
    });
   
  });

});

/*
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
*/