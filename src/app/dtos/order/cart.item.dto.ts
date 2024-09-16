import { IsNumber } from 'class-validator';

export class CartItemDTO {
    @IsNumber()
    ebook_id: number;
    @IsNumber()
    quantity: number;

    constructor(data: any) {
        this.ebook_id = data.ebook_id;
        this.quantity = data.quantity;
    }
}
