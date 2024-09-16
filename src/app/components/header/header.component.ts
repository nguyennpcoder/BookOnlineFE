// import { Component, OnInit,HostListener, ElementRef  } from '@angular/core';
// import { UserService } from '../../services/user.service';

// import { ActivatedRoute, Router } from '@angular/router';
// import { TokenService } from '../../services/token.service';
// import { UserResponse } from '../../responses/user/user.response';

// import { CommonModule } from '@angular/common';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { RouterModule } from '@angular/router';  

// @Component({
//   selector: 'app-header',
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.scss'],
//   standalone: true,
//   imports: [    
//     CommonModule,
//     NgbModule,
//     RouterModule
//   ]
// })
// export class HeaderComponent implements OnInit{
//   userResponse?:UserResponse | null;
//   isPopoverOpen = false;
//   activeNavItem: number = 0;
//   isSearchBoxVisible = false; // Biến để kiểm soát việc hiển thị ô tìm kiếm


//   constructor(
//     private userService: UserService,       
//     private tokenService: TokenService,    
//     private router: Router,
//   ) {
    
//    }
//   ngOnInit() {
//     this.userResponse = this.userService.getUserResponseFromLocalStorage();    
//   }  

//   togglePopover(event: Event): void {
//     event.preventDefault();
//     this.isPopoverOpen = !this.isPopoverOpen;
//   }

//   handleItemClick(index: number): void {
//     //alert(`Clicked on "${index}"`);
//     if(index === 0) {
//       debugger
//       this.router.navigate(['/user-profile']);                      
//     }  
//     else if(index === 1) {
//       debugger
//       this.router.navigate(['/order-user']);                      
//     } 
    
//     else if (index === 2) {
//       this.userService.removeUserFromLocalStorage();
//       this.tokenService.removeToken();
//       this.userResponse = this.userService.getUserResponseFromLocalStorage();   
//       this.router.navigate(['/']);
      
//     }
//     this.isPopoverOpen = false; // Close the popover after clicking an item    
//     // location.reload();
//   }

  
//   setActiveNavItem(index: number) {    
//     this.activeNavItem = index;
//     //alert(this.activeNavItem);
//   }  
  
//    // Hàm này để hiển thị hoặc ẩn ô tìm kiếm
//    toggleSearchBox(): void {
//     this.isSearchBoxVisible = !this.isSearchBoxVisible;
//   }
 
 
// }

import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/user/user.response';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { Ebook } from '../../models/ebook';
import { CartService } from '../../services/cart.service';
import { LoveService } from '../../services/love.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    RouterModule
  ]
})
export class HeaderComponent implements OnInit {
  userResponse?: UserResponse | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;
  isSearchBoxVisible = false;
  cartItems: { ebook: Ebook, quantity: number }[] = [];
  cart: Map<number, number> = new Map();
  cartItemCount: number = 0; 
  loveItemCount: number =0;
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private cartService : CartService,
    private lovetService: LoveService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
   
  
    this.cart = this.cartService.getCart();
    const ebookIds = Array.from(this.cart.keys()); 
    if(this.userResponse)
    {
        this.updateCartItemCount();
        this.updateLoveItemCount();
    }
  }
 
  // loadCartItems() {
  //   this.cart = this.cartService.getCart();
  //   const ebookIds = Array.from(this.cart.keys());
  //   this.updateCartItemCount();

  //   if (ebookIds.length === 0) {
  //     this.cartItemCount = 0; // Cập nhật số lượng sản phẩm trong giỏ hàng
  //     return;
  //   }
  // }

  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number): void {
    if (index === 0) {
      this.router.navigate(['/user-profile']);
    } else if (index === 1) {
      this.router.navigate(['/order-user']);
    } else if (index === 2) {
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = this.userService.getUserResponseFromLocalStorage();
      this.router.navigate(['/']); 
      location.reload();
    }
    this.isPopoverOpen = false;
   
  }

  setActiveNavItem(index: number) {
    this.activeNavItem = index;
  }

  toggleSearchBox(): void {
    this.isSearchBoxVisible = !this.isSearchBoxVisible;
  }
  checklogin(): void{
    if (!this.tokenService.getUserId()) {
      alert('Bạn cần đăng nhập.');
      return;
    }
  }

  private updateCartItemCount(): void {
    this.cartItemCount = this.cartService.getTotalItemCount();
  }
private updateLoveItemCount():void{
  this.loveItemCount = this.lovetService.getTotalLoveItemCount();
}

}
