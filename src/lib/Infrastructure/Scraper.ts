import rp from 'request-promise';
import cheerio from 'cheerio';
import {Product} from  'app/lib/Model/Product/Product';
import { ProductInterface } from 'app/lib/Model/Product/ProductInterface';

export class Scraper {

    products: ProductInterface[] = [];

    constructor(protected fistPageUrl: string, protected pageUrlPagination: string, protected numberOfPage:number) {
        //init class    
    }


    public async scrapeAll()
    {
     
        for (let p = 1; p <= this.numberOfPage; p++) { 
            let pageUrl = this._buildPageUrl(p);
           
            console.log('Scraping page #'+p + 'from url: '+ pageUrl);

            //Load page HTML into Cheerio
            const c:CheerioStatic = await this.loadHtmlFromUrl(pageUrl);

            //Extract the product into an array
            this.scrapeProducts(c);

            console.log('Product parsed so far: '+ this.products.length);
        }
    }

    protected _buildPageUrl(page:number)
    {
        if (page == 1) {
            return this.fistPageUrl;
        } else {
            return this.pageUrlPagination + page;
        }
    }


    protected async loadHtmlFromUrl(url:string) {
        const options = {
            uri: url,
            transform: function (body: string) {
                return cheerio.load(body);
            }
          }; 
        //Async api call  
        const $: CheerioStatic = await rp(options);
        return $;
    }

    public async loadHtml(html:string) {
        //Async api call  
        const $: CheerioStatic = cheerio.load(html);
        return $;
    }


    public scrapeProducts($: CheerioStatic) {
        var self = this;
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
            self.products.push(
                new Product(productId, productBrand, productName, productUrl)
            );   
        });
    }

}