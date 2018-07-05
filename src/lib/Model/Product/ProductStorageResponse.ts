import {ProductStorageResponseInterface} from  'app/lib/Model/Product/ProductStorageResponseInterface';

// Define Product Class
export class ProductStorageResponse implements ProductStorageResponseInterface{
    constructor(public status: boolean, public affectedRows: number) {
        
    }
}