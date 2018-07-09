import { assert } from  'chai'; 
import { ProductStorageInmemory } from 'app/lib/Infrastructure/ProductStorageInmemory';
import { Product } from 'app/lib/Model/Product/Product';
import { ProductApi } from 'app/lib/Model/Product/ProductApi';
import {ProductApiListResponse, ProductApiDeleteResponse} from 'app/lib/Model/Product/ProductApiResponses';
import {Scraper} from 'app/lib/Infrastructure/Scraper';
import {readFileSync} from 'fs';

//import { ProductStorageResponse } from 'app/lib/Model/Product/ProductStorageResponse';
import {config} from 'app/config/config';


// Initialize objects
/*
let productStorage  = new ProductStorageInmemory();
let api             = new ProductApi(productStorage, config.api);
let productScraper = new Scraper('','',1);
*/
describe('Product Api', () => {
  describe('Scrape and list', () => {

    let productScraper  = new Scraper('','',1);
    let productStorage  = new ProductStorageInmemory();
    let api             = new ProductApi(productStorage, config.api);
    let productList:ProductApiListResponse;

    before(async () => {
        // Scrape products
        var testHtml:string = readFileSync( __dirname +'/mockData/product.html', 'utf8');
        let c:CheerioStatic = await productScraper.loadHtml(testHtml);
        productScraper.scrapeProducts(c);

        //Save Product 
        productScraper.products.forEach(async function(el){
          await productStorage.save(el);
        });

        //Load Product using api
        productList = await api.list(1);
    });

    it('api.list() response should be an instance of ProductApiListResponse', function() {
        assert.instanceOf(productList, ProductApiListResponse);
    });
  
    it('api.list() should retourn product scraped', function() {
        assert.isAbove(productList.data.length, 0);
    });

    it('First product returned by api.list() should match first product scraped', function() {
        assert.equal(productList.data[0].id, 2986438);
        assert.equal(productList.data[0].name, 'Black Nicholas Sweater');
        assert.equal(productList.data[0].brand,  'Acne Studios');
    });

  });

  describe('Delete product', () => {

  
    let productStorage:ProductStorageInmemory; 
    let product1        = new Product(111, 'name', 'brand', 'url');
    let product2        = new Product(222, 'name', 'brand', 'url');
    let api:ProductApi;

    beforeEach(async () => {
        //Preload Product
       
        productStorage  = new ProductStorageInmemory();
        productStorage.save(product1);
        productStorage.save(product2);
        api = new ProductApi(productStorage, config.api);
    });

    it('api.delete() should return an instance of ProductApiDeleteResponse', async ()=> {
      let deleteResponse =  await api.delete(product1.id);
      assert.instanceOf(deleteResponse, ProductApiDeleteResponse);
    });

    it('api.delete() should delete product', async () => {
      let numberOfProducts = Object.keys(productStorage.productList).length;
      await api.delete(product1.id);
      assert.equal(Object.keys(productStorage.productList).length, numberOfProducts-1);
    });

    it('api.list() should return not return deleted product', async () => {
    
      await api.delete(product1.id);
      let listResponse:ProductApiListResponse = await api.list(1);
      assert.equal(listResponse.data.length, 1);
      assert.equal(listResponse.data[0].id, product2.id),'';
    });
    

  });

});
/*
//====================================================================================//
// Scraper: Scrape products
//====================================================================================//
describe('Scraper', () => {
  describe('scrape product', function() {
    before(async () => {
      var testHtml:string = readFileSync( __dirname +'/mockData/product.html', 'utf8');
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

        // to do add get by ID test

      });   
    });
  });
});


//====================================================================================//
// Api: test api calls
//====================================================================================//
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


//====================================================================================//
// Delete: test api calls
//====================================================================================//
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
   
    // to do add get by ID test

  });

});
*/