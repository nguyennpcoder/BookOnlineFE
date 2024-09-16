import {OrderDetail} from './order.detail'
export interface Order {
    id: number;
    user_id: number;
    fullname: string; 
    phone_number: string; 
    note: string;
    order_date: Date; 
    status: string;
    total_money: number; 
    tracking_number: string; 
    payment_method: string; 
    active: boolean;
    order_details: OrderDetail[]; 
    
  }  
