import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgModule } from '@angular/core';

import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { OrderResponse } from '../../../responses/order/order.response';
import { OrderService } from '../../../services/order.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../models/order';

@Component({
  selector: 'app-order-admin',
  templateUrl: './order.admin.component.html',
  styleUrls: ['./order.admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class OrderAdminComponent implements OnInit {
  orders: OrderResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  keyword: string = "";
  visiblePages: number[] = [];
  localStorage?: Storage;
  errorMessage: string = '';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }
  ngOnInit(): void {
    debugger
    //
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
    this.currentPage = Number(this.localStorage?.getItem('currentOrderAdminPage')) || 0;

  }
  searchOrders() {
    this.currentPage = 0;
    this.itemsPerPage = 5;
    //Mediocre Iron Wallet
    debugger
    this.getAllOrders(this.keyword.trim(), this.currentPage, this.itemsPerPage);
  }
  // getAllOrders(keyword: string, page: number, limit: number) {
  //   debugger
  //   this.orderService.getAllOrders(keyword, page, limit).subscribe({
  //     next: (response: any) => {
  //       debugger        
  //       // this.orders = response.orders;


  //       this.totalPages = response.totalPages;
  //       this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
  //     },
  //     complete: () => {
  //       debugger;
  //     },
  //     error: (error: any) => {
  //       debugger;
  //       console.error('Error fetching ebook:', error);
  //     }
  //   });    
  // }
  getAllOrders(keyword: string, page: number, limit: number) {
    this.orderService.getAllOrders(keyword, page, limit).subscribe({
      next: (response: any) => {
        this.orders = response.orders.map((order: OrderResponse) => ({
          ...order,
          active: order.active === true // Convert to boolean
        }));
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (error: any) => {
        console.error('Error fetching orders:', error);
      }
    });
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentOrderAdminPage', String(this.currentPage));
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }
    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }

  deleteOrder(id: number) {
    const confirmation = window
      .confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?');
    if (confirmation) {
      debugger
      this.orderService.deleteOrder(id).subscribe({
        next: (response: any) => {
          this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
          debugger
          // this.errorMessage = '';
          alert('Xóa Order thành công');
          location.reload();
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          this.handleError(error, 'deleting order');
        },
      });
    }
  }
  updateActiveStatus(order: Order) {
    this.orderService.updateActiveStatus(order.id).subscribe({
      next: (response) => {
        // Toggle between 1 and 0
        order.active = !order.active;
        alert(order.active === true ? 'Mở khóa thành công.' : 'Khóa thành công.');
      },
      error: (error) => {
        alert('Failed to update status.');
        console.error('Update status error:', error);
      }
    });
  }





  // deleteOrder(id: number) {
  //   const confirmation = window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?');
  //   if (confirmation) {
  //     this.orderService.deleteOrder(id).subscribe({
  //       next: (response: any) => {
  //         this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  //         this.errorMessage = '';
  //       },
  //       error: (error: any) => {
  //         this.handleError(error, 'deleting order');
  //       },
  //     });
  //   }
  // }

  private handleError(error: any, context: string): void {
    console.error(`Error in ${context}:`, error);
    switch (error.status) {
      case 401:
        alert('Bạn cần đăng nhập quyền quản trị để thao tác vào tài nguyên này.');
        // Có thể chuyển hướng đến trang đăng nhập ở đây
        break;
      case 404:
        alert('Không tìm thấy tài nguyên.');
        break;
      case 500:
        alert('Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.');
        break;
      default:
        alert('Đã xảy ra lỗi. Vui lòng thử lại.');
        break;
    }
  }

  viewDetails(order: OrderResponse) {
    debugger
    this.router.navigate(['/admin/orders', order.id]);

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

}