import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
// import { Order } from '../../models/order';
import { OrderResponse } from '../../responses/order/order.response';
import { OrderService } from '../../services/order.service';
import { OrderDetail } from '../../models/order.detail';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { EbookMp3 } from '../../models/ebook.mp3';
import { Order } from '../../models/order';

@Component({
  selector: 'app-detail-order-user',
  templateUrl: './detail.order.user.component.html',
  styleUrls: ['./detail.order.user.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    
        
]
})

export class DetailOrderUserComponent implements OnInit {
  order?: Order;
  orderId: number = 0;
  isPlaying = false;
  currentMp3Index: number = 0;

  orderResponse: OrderResponse = {

    id: 0,
    user_id: 0,
    fullname: '',
    phone_number: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0,
    payment_method: '',
    order_details: [],
    tracking_number: '', 
    active: false,    
  
    
  };

  private orderService: OrderService;

  constructor(
    private route: ActivatedRoute,
    private router: Router,

    @Inject(OrderService) orderService: OrderService // Inject đã được sửa
  ) {
    this.orderService = orderService;
  }

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderByUserId(this.orderId).subscribe({
      next: (response: any) => {
        debugger;
        // this.orderResponse = {
        //   ...response, 
        //   order_date: response.order_date ? new Date(response.order_date) : new Date(),
        //   order_details: response.order_details.map(order_detail => ({
        //     ...order_detail,
        //     ebook: {
        //       ...order_detail.ebook,
        //       image: order_detail.ebook.image ? `${environment.apiBaseUrl}/ebooks/images/${order_detail.ebook.image}` : '' // Chỉ sử dụng một chuỗi image URL từ mảng image nếu có
        //     }
        //   }))
        // };
        this.orderResponse.id=response.id;
        this.orderResponse.user_id=response.user_id;
        this.orderResponse.fullname=response.fullname;
        this.orderResponse.phone_number=response.phone_number;
        this.orderResponse.note=response.note;
        if (response.order_date) {
          this.orderResponse.order_date = new Date(
            response.order_date[0], 
            response.order_date[1] - 1, 
            response.order_date[2]
          );        
        };
        this.orderResponse.status=response.status;
        this.orderResponse.total_money=response.total_money;
        this.orderResponse.payment_method=response.payment_method;
        this.orderResponse.order_details = response.order_details
          .map((order_detail:any) => {
          order_detail.ebook.thumbnail = `${environment.apiBaseUrl}/ebooks/images/${order_detail.ebook.thumbnail}`;
          order_detail.ebook.audioUrl = `${environment.apiBaseUrl}/ebooks/audios/${order_detail.ebook.audioUrl}`;

          // if (response.ebook_mp3s.length>0) {
          //   response.ebook_mp3s.forEach((ebook_mp3: EbookMp3) => {
          //     if (!ebook_mp3.mp3_url.startsWith(environment.apiBaseUrl)) {
          //       order_detail.ebook.ebook_mp3s.mp3_url = `${environment.apiBaseUrl}/ebooks/audios/${ebook_mp3.mp3_url}`;
          //     }
          //   });
          // }
          return order_detail;
        });   
        debugger      

      },
      error: (error: any) => {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
      }
    });
  }

  // saveOrder(): void {
  //   this.orderService.updateOrder(this.orderId, new OrderDTO(this.orderResponse)).subscribe({
  //     next: () => {
  //       this.router.navigate(['../'], { relativeTo: this.route });
  //     },
  //     error: (error: any) => {
  //       console.error('Lỗi khi cập nhật đơn hàng:', error);
  //       this.router.navigate(['../'], { relativeTo: this.route });
  //     }
  //   });
  // }

  back(): void {
    this.router.navigate(['/order-user'], { relativeTo: this.route });
  }

  trackByEbookName(index: number, item: any): string {
    return item.ebook.name;
  }

  onEbookClick(ebookId: number): void {
    // Ensure orderResponse is correctly checked
    if (this.order?.active === true) {
      alert('Đơn mua hàng tạm khóa. Vui lòng liên hệ admin');
      return;
    }
    // Navigate to the ebook details page
    this.router.navigate(['/ebooks', ebookId]);
  }
  

  onPlay() {
    this.isPlaying = true;
  }

  onPause() {
    this.isPlaying = false;
  }

  playAudio() {
    this.isPlaying = true;
    setTimeout(() => {
      const audio: HTMLAudioElement | null = document.querySelector('audio');
      if (audio) {
        audio.play();
      }
    }, 0);  // Ensure audio element is rendered before calling play()
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

  CancelOrder(order: OrderResponse): void {
    if (order.status !== 'PROCESSING') {
      console.error('Only orders with status PROCESSING can be canceled.');
      return;
    }
    this.orderService.cancelOrder(order.id).subscribe({
      next: (response: any) => {
     
        // Xử lý phản hồi sau khi hủy đơn hàng thành công
        order.status = 'CANCEL'; // Cập nhật trạng thái của đơn hàng trong danh sách  
        
       
      },
      error: (error: any) => {
        console.error('Error canceling order:', error);
      }
    });
    alert('Bạn đã hủy thành công');
    location.reload();
  }
}
