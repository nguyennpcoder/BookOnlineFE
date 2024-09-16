import { EbookMp3 } from "../../models/ebook.mp3";
import { OrderDetail } from "../../models/order.detail";

export interface OrderResponse {
    id: number;
    user_id: number;
    fullname: string;
    phone_number: string;
    note: string;
    order_date: Date; // Dạng chuỗi ISO 8601
    status: string;
    total_money: number;
    image?: string;
    payment_method: string;
    // ebook_mp3s: EbookMp3[]; 
    order_details: any[]; // Đảm bảo có một interface OrderDetail tương ứng
    active: boolean;
    tracking_number: string; // Thêm thuộc tính này

  }
  