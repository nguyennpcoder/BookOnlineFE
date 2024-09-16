import { Component, OnInit } from '@angular/core';
import { Ebook } from '../../models/ebook'; 
import { CartService } from '../../services/cart.service';
import { EbookService } from '../../services/ebook.service';
import { OrderService } from '../../services/order.service';
import { OrderDTO } from '../../dtos/order/order.dto';
import { ActivatedRoute } from '@angular/router';
import { OrderResponse } from '../../responses/order/order.response';
import { environment } from '../../../environments/environment';
import { OrderDetail } from '../../models/order.detail';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order.detail.component.html',
  styleUrls: ['./order.detail.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule
  ]
})
export class OrderDetailComponent implements OnInit {  
  orderResponse: OrderResponse = {
    id: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    user_id: 0,
    fullname: '',
    phone_number: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    payment_method: '',
    order_details: [], // Một mảng rỗng
    tracking_number: '', // Thêm thuộc tính này
    active: false,       // Thêm thuộc tính này
  };  
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
    ) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }
  
  getOrderDetails(): void {
    debugger
    const orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.orderService.getOrderById(orderId).subscribe({
      next: (response: any) => {        
        debugger;       
        this.orderResponse.id = response.id;
        this.orderResponse.user_id = response.user_id;
        this.orderResponse.fullname = response.fullname;
        this.orderResponse.phone_number = response.phone_number;
        this.orderResponse.note = response.note;
        this.orderResponse.order_date = new Date(
          response.order_date[0], 
          response.order_date[1] - 1, 
          response.order_date[2]
        );        
        
        this.orderResponse.order_details = response.order_details
          .map((order_detail: OrderDetail) => {
          order_detail.ebook.title = `${environment.apiBaseUrl}/ebooks/images/${order_detail.ebook.title}`;
          return order_detail;
        });        
        this.orderResponse.payment_method = response.payment_method;
        // this.orderResponse.shipping_date = new Date(
        //   response.shipping_date[0], 
        //   response.shipping_date[1] - 1, 
        //   response.shipping_date[2]
        // );
        
        //this.orderResponse.shipping_method = response.shipping_method;
        
        this.orderResponse.status = response.status;
        this.orderResponse.total_money = response.total_money;
      },
      complete: () => {
        debugger;        
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      }
    });
  }
  formatPrice(price: number | undefined): string {
    
    if (price === undefined) {
      return 'N/A'; // hoặc giá trị mặc định khác bạn muốn hiển thị
    }
    if(price===0)
    {
        return 'Miễn Phí';
    }
    return price.toLocaleString('vi-VN') + ' đ';
  }
}

