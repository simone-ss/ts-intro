import { ProductStorageInterface } from "app/lib/Model/Product/ProductStorageInterface";
import { ProductInterface } from  'app/lib/Model/Product/ProductInterface';
import { Product } from 'app/lib/Model/Product/Product';
import { Connection } from 'mysql';
import { ProductStorageResponse } from "app/lib/Model/Product/ProductStorageResponse";
//import { ProductStorageResponseInterface } from "app/lib/Model/Product/ProductStorageResponseInterface";


// Define Product Class
export class ProductStorageMysql implements ProductStorageInterface{
    

    constructor(protected connection: Connection) {
        //init class        
    }

    public async save(product:ProductInterface) : Promise<ProductStorageResponse> {
      
        var sql = "REPLACE INTO product (id, name, brand, url, timestamp_added) VALUES ?";
        var dateTime = new Date();
        var timeNow = dateTime.getFullYear()+'-'+dateTime.getMonth()+'-'+dateTime.getDay()+' '+dateTime.getHours()+':'+dateTime.getMinutes();
        var values = [
          [product.id, product.name, product.brand, product.url,  timeNow]
        ];

        return new Promise<ProductStorageResponse>( ( resolve, reject ) => {
            this.connection.query( sql, [values], ( err, rows ) => {
                if ( err )
                     return reject( err );
                return resolve( new ProductStorageResponse(true, rows.affectedRows) );
            } );
        } );
        
    }


    public async list(offset:number, limit: number): Promise<Array<ProductInterface>>
    {
        var sql = 'SELECT * FROM `product` LIMIT ' + offset + ',' + limit;
        var data = await this.executeQuery(sql);
        return this._formatResults(data);
    }

    public async delete(id:number) : Promise<ProductStorageResponse> {
      
        let sql = 'DELETE FROM product WHERE id = ? LIMIT 1';
        let values = [
         id
        ];

        return new Promise<ProductStorageResponse>( ( resolve, reject ) => {
            this.connection.query( sql, [values], ( err, rows ) => {
                if ( err )
                     return reject( err );
                return resolve( new ProductStorageResponse(true, rows.affectedRows) );
            } );
        } );
    }

    protected executeQuery (sql: string, params?:any) : Promise<Array<ProductInterface>>
    {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, params, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }

    /**
     * Format results
     * @param queryResult 
     */
    protected _formatResults(queryResult: Array<ProductInterface>) : Array<ProductInterface>
    {
        var productList : ProductInterface[] = [];

        queryResult.forEach(function(el) {
            productList.push(
                new Product(
                    el.id,
                    el.brand, 
                    el.name, 
                    el.url
                )
            )  
          });
        
        return productList
    }
   

}