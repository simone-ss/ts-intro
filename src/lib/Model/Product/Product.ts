import {ProductInterface} from  'src/lib/Model/Product/ProductInterface';

// Define Product Class
export class Product implements ProductInterface{
    constructor(public id: number, public brand: string, public name: string, public url: string) {
        
    }
}