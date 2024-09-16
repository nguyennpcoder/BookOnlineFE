import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
  standalone: true,
  imports: [RouterModule,
    HeaderComponent,
    FooterComponent,
  ]  // Import RouterModule for routing features
})
export class PaymentSuccessComponent implements OnInit {
  orderInfo: string | null = '';
  
  paymentTime: string | null = '';
  transactionId: string | null = '';
  totalPrice: string | null = '';



  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderInfo = params['orderInfo'] || '';
      this.paymentTime = params['paymentTime'] || '';
      this.transactionId = params['transactionId'] || '';
      this.totalPrice = params['totalPrice'] || '';
      if (this.totalPrice && this.totalPrice.length >= 2 && this.totalPrice.endsWith("00")) {
        this.totalPrice = this.totalPrice.slice(0, -2);
      }
    });
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

  getFormattedPrice(): string {
    const price = this.totalPrice ? Number(this.totalPrice) : undefined;
    return this.formatPrice(price);
  }
  
}


// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, RouterModule } from '@angular/router';
// import { FooterComponent } from '../footer/footer.component';
// import { HeaderComponent } from '../header/header.component';

// @Component({
//   selector: 'app-payment-success',
//   templateUrl: './payment-success.component.html',
//   styleUrls: ['./payment-success.component.scss'],
//   standalone: true,
//   imports: [RouterModule, HeaderComponent, FooterComponent]
// })
// export class PaymentSuccessComponent implements OnInit {
//   orderInfo: string | null = '';
//   paymentTime: string | null = '';
//   transactionId: string | null = '';
//   totalPrice: number | undefined = 0;  // Change type to number

//   constructor(private route: ActivatedRoute) {}

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       this.orderInfo = params['orderInfo'] || '';
//       this.paymentTime = params['paymentTime'] || '';
//       this.transactionId = params['transactionId'] || '';
//       const totalPriceStr = params['totalPrice'] || '0';

//       // Convert totalPriceStr from string to number
//       let totalPrice = parseFloat(totalPriceStr.replace(/[^0-9.]/g, ''));

//       // Ensure totalPrice is a valid number and format it to remove unnecessary decimals
//       if (!isNaN(totalPrice)) {
//         this.totalPrice = parseFloat(totalPrice.toFixed(0)); // No decimal places
//       } else {
//         this.totalPrice = 0;
//       }
//     });
//   }

//   formatPrice(price: number | undefined | null): string {
//     if (price === null || price === undefined) {
//       return 'N/A'; // hoặc giá trị mặc định khác bạn muốn hiển thị
//     }
//     if (price === 0) {
//       return 'Miễn Phí';
//     }
//     // Display price in VND format
//     return price.toLocaleString('vi-VN') + ' đ';
//   }
// }
