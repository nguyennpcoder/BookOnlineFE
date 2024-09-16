// import { Injectable, Inject } from '@angular/core';
// import { Ebook } from '../models/ebook'; 
// import { CommonModule, DOCUMENT } from '@angular/common';

// @Injectable({
//   providedIn: 'root'
// })

// export class CartService {
//   private cart: Map<number, number> = new Map<number, number>(); // Dùng Map để lưu trữ giỏ hàng, key là id sản phẩm, value là số lượng
//   localStorage?:Storage;

//   private cartItems: { productId: number, quantity: number }[] = [];


//   constructor(@Inject(DOCUMENT) private document: Document) {
//     this.localStorage = document.defaultView?.localStorage;
//     // Lấy dữ liệu giỏ hàng từ localStorage khi khởi tạo service            
//     this.refreshCart()
//   }
//   public  refreshCart(){
//     const storedCart = this.localStorage?.getItem(this.getCartKey());
//     if (storedCart) {
//       this.cart = new Map(JSON.parse(storedCart));      
//     } else {
//       this.cart = new Map<number, number>();
//     }
//   }
//   private getCartKey():string {    
//     const userResponseJSON = this.localStorage?.getItem('user'); 
//     const userResponse = JSON.parse(userResponseJSON!);  
//     debugger
//     return `cart:${userResponse?.id ?? ''}`;

//   }

//   addToCart(ebookId: number, quantity: number = 1): void {
//     debugger
//     if (this.cart.has(ebookId)) {
//       // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên `quantity`
//       this.cart.set(ebookId, this.cart.get(ebookId)! + quantity);
//     } else {
//       // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm vào với số lượng là `quantity`
//       this.cart.set(ebookId, quantity);
//     }
//      // Sau khi thay đổi giỏ hàng, lưu trữ nó vào localStorage
//     this.saveCartToLocalStorage();
//   }
  
//   getCart(): Map<number, number> {
//     return this.cart;
//   }
//   // Lưu trữ giỏ hàng vào localStorage
//   private saveCartToLocalStorage(): void {
//     debugger
//     this.localStorage?.setItem(this.getCartKey(), JSON.stringify(Array.from(this.cart.entries())));
//   }  
//   setCart(cart : Map<number, number>) {
//     this.cart = cart ?? new Map<number, number>();
//     this.saveCartToLocalStorage();
//   }
//   // Hàm xóa dữ liệu giỏ hàng và cập nhật Local Storage
//   clearCart(): void {
//     this.cart.clear(); // Xóa toàn bộ dữ liệu trong giỏ hàng
//     this.saveCartToLocalStorage(); // Lưu giỏ hàng mới vào Local Storage (trống)
//   }

//   isProductInCart(productId: number): boolean {
//     return this.cartItems.some(item => item.productId === productId);
//   }
  
// }


import { Injectable, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cart: Map<number, number> = new Map<number, number>(); // Dùng Map để lưu trữ giỏ hàng, key là id sản phẩm, value là số lượng
  localStorage?: Storage;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.localStorage = document.defaultView?.localStorage;
    // Lấy dữ liệu giỏ hàng từ localStorage khi khởi tạo service            
    this.refreshCart();
  }

  public refreshCart()
   {
    const storedCart = this.localStorage?.getItem(this.getCartKey());
    if (storedCart) {
      this.cart = new Map(JSON.parse(storedCart));
    } else {
      this.cart = new Map<number, number>();
    }
  }

  private getCartKey(): string {
    const userResponseJSON = this.localStorage?.getItem('user');
    const userResponse = JSON.parse(userResponseJSON!);
    debugger
    return `cart:${userResponse?.id ?? ''}`;
  }

  addToCart(ebookId: number, quantity: number = 1): void {
    debugger
    if (this.cart.has(ebookId)) {
      // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên `quantity`
      this.cart.set(ebookId, this.cart.get(ebookId)! + quantity);
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm vào với số lượng là `quantity`
      this.cart.set(ebookId, quantity);
    }
    // Sau khi thay đổi giỏ hàng, lưu trữ nó vào localStorage
    this.saveCartToLocalStorage();
  }

  getCart(): Map<number, number> {
    return this.cart;
  }

  // Lưu trữ giỏ hàng vào localStorage
  private saveCartToLocalStorage(): void {
    this.localStorage?.setItem(this.getCartKey(), JSON.stringify(Array.from(this.cart.entries())));
  }

  setCart(cart: Map<number, number>) {
    this.cart = cart ?? new Map<number, number>();
    this.saveCartToLocalStorage();
  }

  // Hàm xóa dữ liệu giỏ hàng và cập nhật Local Storage
  clearCart(): void {
    this.cart.clear(); // Xóa toàn bộ dữ liệu trong giỏ hàng
    this.saveCartToLocalStorage(); // Lưu giỏ hàng mới vào Local Storage (trống)
  }

  // Kiểm tra xem sản phẩm có trong giỏ hàng hay không
  isProductInCart(productId: number): boolean {
    return this.cart.has(productId);
  }

  getTotalItemCount(): number {
    let total = 0;
    this.cart.forEach(quantity => total += quantity);
    return total;
  }
  
}
