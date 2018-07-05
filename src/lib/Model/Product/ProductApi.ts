import { ProductStorageInterface } from "app/lib/Model/Product/ProductStorageInterface";
import {ProductApiListResponse, ProductApiDeleteResponse} from "app/lib/Model/Product/ProductApiResponses"; 

export class ProductApi{


    constructor(protected productStorage: ProductStorageInterface, protected config: any) {
        
    }


    public async list(page:number)
    {

        let limit = page * this.config.itemPerPage;
        let offset = limit - this.config.itemPerPage;

        var promisData = await this.productStorage.list(offset, limit);

        return new ProductApiListResponse(true, promisData);
        

    }

    public async delete(id:number)
    {
        var promisData = await  this.productStorage.delete(id);

        return new ProductApiDeleteResponse(true, promisData.affectedRows)
    }

}