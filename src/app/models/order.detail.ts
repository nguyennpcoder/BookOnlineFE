import {Order} from './order'
import { Ebook } from "./ebook";
export interface OrderDetail {
    id: number;
    order: Order;
    ebook: Ebook;
    price: number;
    image?: string;
    total_money: number; 
    color?: string; // Dấu "?" cho biết thuộc tính này là tùy chọn
}