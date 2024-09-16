import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { OrderResponse } from '../../responses/order/order.response';
import { OrderService } from '../../services/order.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { TokenService } from '../../services/token.service';
import { Order } from '../../models/order';
import { UserService } from '../../services/user.service';
import { OrderDTO } from '../../dtos/order/order.dto';
import { OrderDetailComponent } from '../detail-order/order.detail.component';
import { OrderStatusDetailDTO } from '../../dtos/order/order-status-detail.dto';

@Component({
  selector: 'app-order-user',
  templateUrl: './order.user.component.html',
  styleUrls: ['./order.user.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
  ]
})
export class OrderUserComponent implements OnInit {
  orders: OrderResponse[] = [];
  totalPages: number = 0;
  order?: Order;
  keyword: string = "";
  currentPage: number = 0;
  totalAmount: number = 0; // Tổng tiền
  itemsPerPage: number = 12;
  // pages: number[] = [];
  ebookId: number = 293;
  visiblePages: number[] = [];
  localStorage?: Storage;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService,
    private tokenService: TokenService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  ngOnInit(): void {
    this.currentPage = Number(this.localStorage?.getItem('currentOrderUserPage')) || 0;
    const userId = this.tokenService.getUserIdFromLocalStorage();
    if (userId && !isNaN(userId)) {
      this.getOrdersByUserId(userId, this.keyword, this.currentPage, this.itemsPerPage);
    } else {
      console.error('Invalid userId:', userId);
      this.router.navigate(['/login']);
    }



  }
  searchOrders() {
    this.currentPage = 0;
    const userId = this.tokenService.getUserId();
    if (userId && !isNaN(userId)) {
      this.getOrdersByUserId(userId, this.keyword.trim(), this.currentPage, this.itemsPerPage);
    }
  }

  getOrdersByUserId(userId: number, keyword: string, page: number, limit: number) {
    this.orderService.getAllOrdersByUserId(userId, keyword, page, limit).subscribe({
      next: (response: any) => {
        //this.orders = response.orders; //response trong code server em tra ve mang luon
        this.orders = response;
        this.totalPages = response.totalPages; //ko thay tra ve totalPages
        // this.totalPages = 1;//fix tam
        debugger
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        // this.checkAndCancelOrders();
      },
      error: (error: any) => {
        console.error('Error fetching orders:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }



  onPageChange(page: number) {
    this.currentPage = page < 0 ? 0 : page;
    const userId = this.tokenService.getUserId();
    if (userId && !isNaN(userId)) {
      this.localStorage?.setItem('currentOrderUserPage', String(this.currentPage));
      this.getOrdersByUserId(userId, this.keyword, this.currentPage, this.itemsPerPage);
    }
  }

  // generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
  //   const maxVisiblePages = 5;
  //   const halfVisiblePages = Math.floor(maxVisiblePages / 2);
  //     if (totalPages <= 0) {
  //     return [];
  //   }

  //   let startPage = Math.max(currentPage - halfVisiblePages, 1);
  //   let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  //   if (endPage - startPage + 1 < maxVisiblePages) {
  //     startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  //   }

  //   // Ensure startPage and endPage are within valid range
  //   startPage = Math.max(startPage, 1);
  //   endPage = Math.min(endPage, totalPages);

  //   // Calculate the number of pages in the visible range
  //   const numberOfPages = endPage - startPage + 1;

  //   // Ensure the number of pages is a valid array length
  //   if (numberOfPages <= 0) {
  //     return [];
  //   }

  //   return new Array(numberOfPages).fill(0).map((_, index) => startPage + index);
  // }


  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    // Đảm bảo startPage và endPage nằm trong phạm vi hợp lệ
    startPage = Math.max(startPage, 1);
    endPage = Math.min(endPage, totalPages);

    // Tính số trang trong phạm vi hiển thị
    const numberOfPages = endPage - startPage + 1;

    // Đảm bảo số trang là độ dài mảng hợp lệ
    if (numberOfPages <= 0) {
      return [];
    }
    debugger
    return new Array(numberOfPages).fill(0).map((_, index) => startPage + index);
  }


  viewDetails(order: OrderResponse): void {
    // Ensure we're checking the correct order's active status
    if (order.active === false) {
      alert('Đơn mua hàng tạm khóa. Vui lòng liên hệ admin');
      return;
    }
    // Proceed with navigation if the order is active
    this.router.navigate(['/orders/order-user', order.id]);
  }




  // buyment(order: OrderResponse) {
  //   this.router.navigate(['/payment-form'], { queryParams: { amount: order.total_money, orderInfo: order.id } });
  // }


  buyment(order: OrderResponse) {
    this.orderService.getAllOrdersStatus().subscribe({
      next: (ordersStatus) => {
        if (this.ebookId) {
          const completeOrderExists = ordersStatus.some(status => status.ebook_id === this.ebookId && status.status === 'COMPLETE');
          if (completeOrderExists) {
            alert('Tồn tại ebook đã mua hãy nhấn Hủy đơn');
          }
         else {
            this.router.navigate(['/payment-form'], { queryParams: { amount: order.total_money, orderInfo: order.id } });
          }
        }
      },
      error: (error: any) => {
        console.error('Error fetching orders status:', error);
      }
    });
  }

  trackByOrderId(index: number, order: OrderResponse): number {
    return order.id;
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
    if (confirm('Xác nhận Hủy?')) {

      this.orderService.cancelOrder(order.id).subscribe
        ({
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

  // checkAndCancelOrders() {
  //   this.orderService.getAllOrdersStatus().subscribe({
  //     next: (ordersStatus: any[]) => {
  //       // Group orders by ebook_id and collect statuses
  //       const ordersMap = new Map<number, { hasComplete: boolean; processingOrder: OrderResponse | null }>();

  //       ordersStatus.forEach(order => {
  //         const entry = ordersMap.get(order.ebook_id);

  //         if (entry) {
  //           if (order.status === 'COMPLETE') {
  //             entry.hasComplete = true;
  //           }
  //           if (order.status === 'PROCESSING') {
  //             entry.processingOrder = order;
  //           }
  //         } else {
  //           ordersMap.set(order.ebook_id, {
  //             hasComplete: order.status === 'COMPLETE',
  //             processingOrder: order.status === 'PROCESSING' ? order : null
  //           });
  //         }
  //       });

  //       // Iterate through the map to cancel processing orders if there's a complete order
  //       ordersMap.forEach((entry) => {
  //         if (entry.hasComplete && entry.processingOrder) {
  //           this.orderService.cancelOrder(entry.processingOrder.id).subscribe({
  //             next: (response: any) => {
  //               // Update the order status to CANCEL locally
  //               const orderToUpdate = this.orders.find(order => order.id === entry.processingOrder?.id);
  //               if (orderToUpdate) {
  //                 orderToUpdate.status = 'CANCEL';
  //               }
  //             },
  //             error: (error: any) => {
  //               console.error('Error canceling order:', error);
  //             },
  //             complete: () => {
  //               console.log('Order canceled successfully');
  //               // Optionally, refresh the orders list
  //               // this.getOrdersByUserId(this.tokenService.getUserId(), this.keyword, this.currentPage, this.itemsPerPage);
  //             }
  //           });
  //         }
  //       });
  //     },
  //     error: (error: any) => {
  //       console.error('Error fetching orders status:', error);
  //       alert('Đã xảy ra lỗi khi lấy thông tin đơn hàng. Vui lòng thử lại sau.');
  //     }
  //   });
  // }




  // checkAndCancelOrders() {
  //   // Fetch all orders statuses
  //   this.orderService.getAllOrdersStatus().subscribe({
  //     next: (ordersStatus: any[]) => {
  //       // Group orders by ebook_id and collect their statuses
  //       const ordersMap = new Map<number, string[]>();
  //       this.orders.forEach(order => {
  //         const statuses = ordersMap.get(order.ebook_id) || [];
  //         statuses.push(order.status);
  //         ordersMap.set(order.ebook_id, statuses);
  //       });

  //       // Check each ebook_id for both COMPLETE and PROCESSING statuses
  //       ordersMap.forEach((statuses, ebookId) => {
  //         const hasComplete = statuses.includes('COMPLETE');
  //         const hasProcessing = statuses.includes('PROCESSING');

  //         if (hasComplete && hasProcessing) {
  //           // Find the processing order for cancellation
  //           const processingOrder = this.orders.find(order => order.ebook_id === ebookId && order.status === 'PROCESSING');
  //           if (processingOrder) {
  //             this.CancelOrder(processingOrder);
  //           }
  //         }
  //       });
  //     },
  //     error: (error: any) => {
  //       console.error('Error fetching orders status:', error);
  //       alert('Đã xảy ra lỗi khi lấy thông tin đơn hàng. Vui lòng thử lại sau.');
  //     }
  //   });
  // }
}  