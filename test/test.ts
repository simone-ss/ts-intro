import { assert } from  'chai'; 

const config = require('app/config/config');

import {Scraper} from 'app/lib/Infrastructure/Scraper';
let productScraper = new Scraper(
  config.scraper.fistPageUrl,
  config.scraper.pageUrlPagination,
  1
);


describe('Scraper', function() {
   describe('#scrapeAll()', function() {

    before(async function() {
        await productScraper.scrapeAll();
    });
     
    it('should populate products array', async function() {
      assert.isAbove(productScraper.products.length, 0);
    });

    if (productScraper.products.length > 0) {
      it('products[0]product.id should not be empty', async function() {
        assert.isAbove(productScraper.products[0].id, 0);
      });

      it('products[0]product.name should not be empty', async function() {
          assert.isAbove(productScraper.products[0].name.length, 0);
      });

      it('products[0]product.brand should not be empty', async function() {
          assert.isAbove(productScraper.products[0].brand.length, 0);
      });
    }

        
  });


  /*
describe('Scraper', function() {
  describe('#scrapeAll()', function() {

    let productScraper = new Scraper(
      config.scraper.fistPageUrl,
      config.scraper.pageUrlPagination,
      1
    );


  it('should populate Scraper.products 1', (done) => {

    productScraper.scrapeAll().then(()=>{  
      if(productScraper.products.length > 0) {
        done();
      } else {
        done(new Error('Product not found'));
      }
    });
  
  });

  */

/*
  async function go() {
    await productScraper.scrapeAll();

    it('should populate  Scraper.products', function() {
      assert.isAbove(productScraper.products, 0);
    
    });

  }
 
  go();
*/


});
