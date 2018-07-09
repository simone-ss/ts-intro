import { ProductStorageInterface } from "app/lib/Model/Product/ProductStorageInterface";
import { ProductInterface } from  'app/lib/Model/Product/ProductInterface';
import { ProductStorageResponse } from "app/lib/Model/Product/ProductStorageResponse";
import { ProductStorageResponseInterface } from "app/lib/Model/Product/ProductStorageResponseInterface";


// Define Product Class
export class ProductStorageInmemory implements ProductStorageInterface{
    
    productList: { [key: string]: ProductInterface } = {};

    constructor() {
        //init class        
    }


    public async save(product:ProductInterface) : Promise<ProductStorageResponseInterface> {
        
        
       // let productList2: { [key: string]: ProductInterface } = {};
        this.productList[product.id]= product;


        return this._buildPromise(1); 
    }

    public async list(offset:number, limit: number): Promise<Array<ProductInterface>> {
        let products = Object.entries(this.productList).slice(offset,limit).map(entry => entry[1]);
        return new Promise<Array<ProductInterface>>( ( resolve, _reject ) => {
                resolve( products );
                return products;
        } );
    }

    public async delete(id:number) : Promise<ProductStorageResponseInterface> {
      
        let affectedRow = 0;
        if (this.productList[id] != undefined) {
            delete this.productList[id];
            affectedRow = 1;
        }
    
        return this._buildPromise(affectedRow);
        
    } 

    protected _buildPromise(affectedRows: number) : Promise<ProductStorageResponseInterface> {
        return new Promise( ( resolve, _reject ) => {
            let response = new ProductStorageResponse(true, affectedRows)
                resolve( response );
                return response;
        } );
    }


}