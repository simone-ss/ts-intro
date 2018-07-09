import { ProductStorageInterface } from "app/lib/Model/Product/ProductStorageInterface";
import {ProductApiListResponse, ProductApiDeleteResponse} from "app/lib/Model/Product/ProductApiResponses"; 
import {config} from 'app/config/config';

export class ProductApi{


    constructor(protected productStorage: ProductStorageInterface, protected conf:typeof config.api) {
        
    }


    public async list(page:number)
    {

        let limit = page * this.conf.itemPerPage;
        let offset = limit - this.conf.itemPerPage;

        var promisData = await this.productStorage.list(offset, limit);

        return new ProductApiListResponse(true, promisData);
        

    }

    public async delete(id:number)
    {
        var promisData = await  this.productStorage.delete(id);

        return new ProductApiDeleteResponse(true, promisData.affectedRows)
    }

}