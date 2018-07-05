import { ProductInterface } from "app/lib/Model/Product/ProductInterface";

//Define Product interface
export interface ProductApiResponseInterface {
    status: boolean; 
}

export class ProductApiListResponse implements ProductApiResponseInterface{
    constructor(public status: boolean, public data: Array<ProductInterface>) {
    }
}
    
export class ProductApiDeleteResponse {
    constructor(public status: boolean, public affectedRows: number) {
    }
}