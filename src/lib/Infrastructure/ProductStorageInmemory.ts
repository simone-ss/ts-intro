import { ProductStorageInterface } from "app/lib/Model/Product/ProductStorageInterface";
import { ProductInterface } from  'app/lib/Model/Product/ProductInterface';
import { ProductStorageResponse } from "app/lib/Model/Product/ProductStorageResponse";
import { ProductStorageResponseInterface } from "app/lib/Model/Product/ProductStorageResponseInterface";


// Define Product Class
export class ProductStorageInmemory implements ProductStorageInterface{
    
    productList : ProductInterface[] = [];

    constructor() {
        //init class        
    }

    public async save(product:ProductInterface) : Promise<ProductStorageResponseInterface> {
        this.productList[product.id] = product;
        return this._buildPromise(1);
        
    }

    public async list(offset:number, limit: number): Promise<any> {
        let products = Object.entries(this.productList).slice(offset,limit).map(entry => entry[1]);
        return new Promise( ( resolve, _reject ) => {
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

    protected _buildPromise(affectedRows: any) : Promise<ProductStorageResponseInterface> {
        return new Promise( ( resolve, _reject ) => {
            let response = new ProductStorageResponse(true, affectedRows)
                resolve( response );
                return response;
        } );
    }



}