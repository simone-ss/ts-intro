import { ProductStorageInterface } from "app/lib/Model/Product/ProductStorageInterface";
import { ProductInterface } from  'app/lib/Model/Product/ProductInterface';
import { Product } from 'app/lib/Model/Product/Product';
import { Connection } from 'mysql';


// Define Product Class
export class ProductStorageMysql implements ProductStorageInterface{
    

    constructor(protected connection: Connection) {
        //init class        
    }

    public save(product:ProductInterface) : number {
        
        console.log(product);

        return 0;
    }


    public async list(offset:number, limit: number): Promise<Array<ProductInterface>>
    {

        var sql = 'SELECT * FROM `product` LIMIT ' + offset + ',' + limit;


        var data = await this.executeQuery(sql);
        return this._formatResults(data);

    }

    protected executeQuery (sql: string) : Promise<Array<ProductInterface>>
    {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, null, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
/*
    protected async executeQuerySynchronous(sql: string){
    
        try{
           var rows = await this.executeQuery(sql);
           console.log('await');
           return rows;
            
        }catch(_err) {
            return [];
        }

    }
*/
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