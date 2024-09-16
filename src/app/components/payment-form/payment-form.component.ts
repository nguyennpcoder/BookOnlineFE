import { Component, OnInit } from '@angular/core';
import { VNPayService } from '../../services/vnpay.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [FormsModule, FooterComponent, HeaderComponent],
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {
  amount: number = 0;
  orderInfo: string = ''; // ID của đơn hàng

  constructor(private vnpayService: VNPayService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.amount = +params['amount'] || 0;
      this.orderInfo = params['orderInfo'] || ''; // Nhận ID đơn hàng từ query params
    });
  }

  onSubmit() {
    if (this.orderInfo) {
      this.vnpayService.createOrder(this.amount, this.orderInfo).subscribe(
        (vnpayUrl: string) => {
          window.location.href = vnpayUrl;
        },
        error => {
          console.error('Failed to create order', error);
        }
      );
    } else {
      console.error('OrderInfo is missing');
    }
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
}
