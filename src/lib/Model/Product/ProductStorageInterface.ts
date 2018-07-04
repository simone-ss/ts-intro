import { ProductInterface } from "app/lib/Model/Product/ProductInterface";

//Define Product interface
export interface ProductStorageInterface {
 
    save(product:ProductInterface) : Promise<any> ;
    
    list(offset:number, limit:number): Promise<Array<ProductInterface>>;

    delete(id:number): Promise<any>;
}


