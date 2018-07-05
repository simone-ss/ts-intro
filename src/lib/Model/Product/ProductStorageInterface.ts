import { ProductInterface } from "app/lib/Model/Product/ProductInterface";
import { ProductStorageResponseInterface } from "app/lib/Model/Product/ProductStorageResponseInterface";

//Define Product interface
export interface ProductStorageInterface {
 
   save(product:ProductInterface) : Promise<ProductStorageResponseInterface> ;
    
   list(offset:number, limit:number): Promise<Array<ProductInterface>>;

   delete(id:number): Promise<ProductStorageResponseInterface>;
}


