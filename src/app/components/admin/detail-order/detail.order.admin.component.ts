import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { OrderDTO } from '../../../dtos/order/order.dto';
import { OrderResponse } from '../../../responses/order/order.response';
import { OrderService } from '../../../services/order.service';
import { OrderDetail } from '../../../models/order.detail';
import { Ebook } from '../../../models/ebook';
import { EbookMp3 } from '../../../models/ebook.mp3';
import { Order } from '../../../models/order';

@Component({
  selector: 'app-detail-order-admin',
  templateUrl: './detail.order.admin.component.html',
  styleUrls: ['./detail.order.admin.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})

export class DetailOrderAdminComponent implements OnInit {
  ebook?: Ebook;
  order?: Order;
  orderId: number = 0;
  currentMp3Index: number = 0;
  isAudioVisible: boolean = false;
  isPlaying: boolean = false;


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
    tracking_number: '', // Thêm thuộc tính này
    active: false,

    // ebook_mp3s:[],
    order_details: []
  };

  private orderService: OrderService;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(OrderService) orderService: OrderService
  ) {
    this.orderService = orderService;
  }

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response: any) => {
        debugger;

        this.orderResponse.id = response.id;
        this.orderResponse.user_id = response.user_id;
        this.orderResponse.fullname = response.fullname;
        this.orderResponse.phone_number = response.phone_number;
        this.orderResponse.note = response.note;
        if (response.order_date) {
          this.orderResponse.order_date = new Date(
            response.order_date[0],
            response.order_date[1] - 1,
            response.order_date[2]
          );
        };
        this.orderResponse.status = response.status;
        this.orderResponse.total_money = response.total_money;
        this.orderResponse.payment_method = response.payment_method;
        this.orderResponse.order_details = response.order_details
          .map((order_detail: any) => {
            order_detail.ebook.thumbnail = `${environment.apiBaseUrl}/ebooks/images/${order_detail.ebook.thumbnail}`;
            // order_detail.ebook.audioUrl = `${environment.apiBaseUrl}/ebooks/audios/${order_detail.ebook.audioUrl}`;

            return order_detail;
          });
        // this.orderResponse.ebook_mp3s.forEach((ebook_mp3s: EbookMp3) => {
        //   if (!ebook_mp3s.mp3_url.startsWith(environment.apiBaseUrl)) {
        //     ebook_mp3s.mp3_url = `${environment.apiBaseUrl}/ebooks/audios/${ebook_mp3s.mp3_url}`;
        //   }
        // });


        // if (orderResponse.length>0) {
        //   response.ebook_mp3s.forEach((ebook_mp3: EbookMp3) => {
        //     if (!ebook_mp3.mp3_url.startsWith(environment.apiBaseUrl)) {
        //       ebook_mp3.mp3_url = `${environment.apiBaseUrl}/ebooks/audios/${ebook_mp3.mp3_url}`;
        //     }
        //   });
        // }

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
  //       alert('Cập nhật trạng thái đơn hàng thành công')
  //       this.router.navigate(['../'], { relativeTo: this.route });
  //     },
  //     error: (error: any) => {
  //       console.error('Lỗi khi cập nhật đơn hàng:', error);
  //       this.router.navigate(['../'], { relativeTo: this.route });
  //     }
  //   });
  // }

  saveOrder(): void {
    this.orderService.updateOrder(this.orderId, new OrderDTO(this.orderResponse)).subscribe({
      next: () => {
        alert('Cập nhật trạng thái đơn hàng thành công');
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (error: any) => {
        console.error('Lỗi khi cập nhật đơn hàng:', error);
        this.handleError(error);
      }
    });
  }
  private handleError(error: any): void {
    console.error('Error:', error);
    switch (error.status) {
      case 401:
        alert('Bạn không có quyền truy cập vào tài nguyên này hoặc cần đăng nhập quản trị viên để thực hiện hành động này.');
        // this.router.navigate(['/']);
        location.reload();
        break;
      case 403:
        alert('Bạn không có quyền cập nhật đơn hàng này. Chỉ có quản trị viên mới có quyền thực hiện hành động này.');
        break;
      case 404:
        alert('Không tìm thấy tài nguyên.');
        break;
      default:
        this.router.navigate(['../'], { relativeTo: this.route });
        break;
    }
  }


  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  trackByEbookName(index: number, item: any): string {
    return item.ebook.name;
  }

  onPlay() {

    this.isPlaying = true;

  }
  onPause() {
    this.isPlaying = false;
  }

  formatPrice(price: number | undefined): string {

    if (price === undefined) {
      return 'N/A'; // hoặc giá trị mặc định khác bạn muốn hiển thị
    }
    if (price === 0) {
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
