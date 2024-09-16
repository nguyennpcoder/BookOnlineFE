import { Component, OnInit } from '@angular/core';
import { Ebook } from '../../models/ebook';
import { EbookImage } from '../../models/ebook.image'; // Thêm import EbookImage
import { CartService } from '../../services/cart.service';
import { EbookService } from '../../services/ebook.service';
import { OrderService } from '../../services/order.service';
import { TokenService } from '../../services/token.service';
import { CouponService } from '../../services/coupon.service'; // Thêm import CouponService
import { environment } from '../../../environments/environment';
import { OrderDTO } from '../../dtos/order/order.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Order } from '../../models/order';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../responses/user/user.response';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class OrderComponent implements OnInit {
  private cartService = inject(CartService);
  private ebookService = inject(EbookService);
  private orderService = inject(OrderService);
  private tokenService = inject(TokenService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);
  userResponse?: UserResponse;

  tokensv: string = "";

  orderForm: FormGroup; // Đối tượng FormGroup để quản lý dữ liệu của form
  cartItems: { ebook: Ebook, quantity: number }[] = [];
  totalAmount: number = 0; // Tổng tiền
  couponDiscount: number = 0; //số tiền được discount từ coupon
  // couponApplied: boolean = false;
  cart: Map<number, number> = new Map();
  orderData: OrderDTO = {
    user_id: 0,
    fullname: '',
    phone_number: '',

    status: 'pending',
    note: '',
    total_money: 0,
    payment_method: 'VNPay',
    cart_items: []
  };
  defaultImageUrl: string = 'uploads/default-image.jpg'; // URL hình ảnh mặc định

  constructor() {
    // Tạo FormGroup và các FormControl tương ứng
    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required], // fullname là FormControl bắt buộc      
      email: ['', [Validators.email]], // Sử dụng Validators.email cho kiểm tra định dạng email
      phone_number: ['', [Validators.required, Validators.minLength(6)]], // phone_number bắt buộc và ít nhất 6 ký tự
      address: ['', [Validators.required, Validators.minLength(5)]], // address bắt buộc và ít nhất 5 ký tự
      note: [''],
      couponCode: [''],
      payment_method: ['VNPay']
    });
  }
  ngOnInit(): void {

    debugger
    this.cartService.refreshCart();
    this.orderData.user_id = this.tokenService.getUserId();
    this.populateUserDetails();


    // Lấy danh sách sản phẩm từ giỏ hàng
    debugger

    this.cart = this.cartService.getCart();
    const ebookIds = Array.from(this.cart.keys()); // Chuyển danh sách ID từ Map giỏ hàng    

    // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID
    debugger
    if (ebookIds.length === 0) {
      return;

    }
    this.ebookService.getEbooksByIds(ebookIds).subscribe({
      next: (ebooks) => {
        debugger
        // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
        this.cartItems = ebookIds.map((ebookId) => {
          debugger
          const ebook = ebooks.find((p) => p.id === ebookId);
          if (ebook) {
            ebook.thumbnail = `${environment.apiBaseUrl}/ebooks/images/${ebook.thumbnail}`;
          }
          return {
            ebook: ebook!,
            quantity: this.cart.get(ebookId)!
          };
        });
        console.log('haha');
      },
      complete: () => {
        debugger;
        this.calculateTotal()
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      }

    });

  }


  // placeOrder() {
  //   debugger
  //   if (this.cartItems.length == 0) {
  //     alert('Giỏ hàng rỗng');
  //   }
  //   else if (this.orderForm.errors == null) {

  //     this.orderData = {
  //       ...this.orderData,
  //       ...this.orderForm.value
  //     };

  //     this.orderData.cart_items = this.cartItems.map(cartItem => ({
  //       ebook_id: cartItem.ebook.id,
  //       quantity: cartItem.quantity
  //     }));

  //     this.orderData.total_money = this.totalAmount;
  //     // Dữ liệu hợp lệ, bạn có thể gửi đơn hàng đi
  //     this.orderService.placeOrder(this.orderData).subscribe({
  //       next: (response: Order) => {
  //         debugger;
  //         // alert('Xác nhận đặt hàng');
  //         if (confirm('Xác nhận đặt hàng?'))
  //         {
  //         this.cartService.clearCart();
  //         // this.router.navigate(['/payment-form']);
  //         this.router.navigate(['/payment-form'], { queryParams: { amount: this.totalAmount, orderInfo: response.id  } });
  //         }
  //       },
  //       complete: () => {
  //         debugger;
  //         this.calculateTotal();
  //       },
  //       error: (error: any) => {
  //         debugger;
  //         alert(`Lỗi khi đặt hàng: ${error}`);
  //       },
  //     });
  //   } else {
  //     // Hiển thị thông báo lỗi hoặc xử lý khác
  //     alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
  //   }
  // }
  private userRole: string = '';
  checkRole(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.tokensv = this.tokenService.getToken();
      this.userService.getUserDetail(this.tokensv).subscribe({
        next: (response: any) => {
          this.userResponse = {
            ...response,
            date_of_birth: new Date(response.date_of_birth),
          };
          this.userRole = this.userResponse?.role.name || '';  // Lưu vai trò người dùng vào biến thành viên
          // alert(`User role: ${this.userRole}`); // Hiển thị vai trò người dùng để kiểm tra
          resolve();
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
          reject(error);
        }
      });
    });
  }

  placeOrder() {
    if (this.cartItems.length === 0) {
      alert('Giỏ hàng rỗng');
      return; // Exit the method if the cart is empty
    }

    ////check admin ko cần mua 
    
    // if (this.tokenService.getUserId()) {
    //   this.checkRole().then(() => {
    //     // Kiểm tra xem người dùng có phải là admin hay không
    //     if (this.userRole === 'admin') {
    //       // Nếu là admin, luôn luôn cho phép xem audio
    //       alert('admin không cần mua')
    //       return;
    //     }
    //   }
    //   )
    // }
    // else {
      if (this.orderForm.errors == null) {
        this.orderData = {
          ...this.orderData,
          ...this.orderForm.value
        };

        this.orderData.cart_items = this.cartItems.map(cartItem => ({
          ebook_id: cartItem.ebook.id,
          quantity: cartItem.quantity
        }));

        this.orderData.total_money = this.totalAmount;
        if (confirm('Xác nhận đặt hàng?')) {
          // Send the order data
          this.orderService.placeOrder(this.orderData).subscribe({
            next: (response: Order) => {
              debugger;
              // Show confirmation dialog

              // User confirmed, proceed with clearing the cart and navigating
              this.cartService.clearCart();
              this.router.navigate(['/payment-form'], { queryParams: { amount: this.totalAmount, orderInfo: response.id } });

              // If the user cancels, do nothing
            },

            complete: () => {
              debugger;
              this.calculateTotal();
            },
            error: (error: any) => {
              debugger;
              alert(`Lỗi khi đặt hàng: ${error}`);
            },
          });
        }
      } else {
        // Handle invalid data case
        alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
      }
   // }
  }



  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      this.calculateTotal();
    }
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
    // Cập nhật lại this.cart từ this.cartItems
    this.updateCartFromCartItems();
    this.calculateTotal();
    location.reload();
  }

  // Hàm tính tổng tiền
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.ebook.price * item.quantity,
      0
    );
  }
  confirmDelete(index: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      // Xóa sản phẩm khỏi danh sách cartItems
      this.cartItems.splice(index, 1);
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      // Tính toán lại tổng tiền
      this.calculateTotal();
      location.reload();
      return;
    }
    // location.reload();
  }

  private updateCartFromCartItems(): void {
    this.cart.clear();
    this.cartItems.forEach((item) => {
      this.cart.set(item.ebook.id, item.quantity);
    });
    this.cartService.setCart(this.cart);
  }

  onEbookClick(ebookId: number) {
    debugger;
    // Điều hướng đến trang detail-ebook với ebookid là tham số
    this.router.navigate(['/ebooks', ebookId]);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + ' đ';
  }
  populateUserDetails(): void {
    const token = this.tokenService.getToken();
    this.userService.getUserDetail(token).subscribe({
      next: (response: UserResponse) => {
        this.orderForm.patchValue({
          fullname: response.fullname,
          phone_number: response.phone_number
        });
      },
      error: (error: any) => {
        console.error('Error fetching user details:', error);
      }
    });
  }
}
