import { ProductStorageInterface } from "app/lib/Model/Product/ProductStorageInterface";
import { ProductInterface } from  'app/lib/Model/Product/ProductInterface';
import { Product } from 'app/lib/Model/Product/Product';
import { Connection } from 'mysql';


// Define Product Class
export class ProductStorageMysql implements ProductStorageInterface{
    

    constructor(protected connection: Connection) {
        //init class        
    }

    public async save(product:ProductInterface) : Promise<Array<any>> {
      
        var sql = "REPLACE INTO product (id, name, brand, url, timestamp_added) VALUES ?";
        var dateTime = new Date();
        var timeNow = dateTime.getFullYear()+'-'+dateTime.getMonth()+'-'+dateTime.getDay()+' '+dateTime.getHours()+':'+dateTime.getMinutes();
        var values = [
          [product.id, product.name, product.brand, product.url,  timeNow]
        ];

        var result = await this.executeQuery(sql,[values]);
   
        console.log(result);
        // result.affectedRows;

       return result;
        
    }


    public async list(offset:number, limit: number): Promise<Array<ProductInterface>>
    {
        var sql = 'SELECT * FROM `product` LIMIT ' + offset + ',' + limit;
        var data = await this.executeQuery(sql);
        return this._formatResults(data);

    }

    protected executeQuery (sql: string, params?:any) : Promise<Array<ProductInterface>>
    {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, params, ( err, rows ) => {
                if ( err )
                    return reject(  );
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