import { Component, OnInit, Inject } from '@angular/core';
import { Ebook } from '../../models/ebook'; 
import { Category } from '../../models/category';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { EbookService } from '../../services/ebook.service';
import { TokenService } from '../../services/token.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import e from 'express';
import { OrderService } from '../../services/order.service';
import { LoveService } from '../../services/love.service';
import { CartService } from '../../services/cart.service';
import { UserResponse } from '../../responses/user/user.response';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule
  ]
})
export class HomeComponent implements OnInit {
  ebooks: Ebook[] = [];
  categories: Category[] = [];
  selectedCategoryId: number = 0;
  currentPage: number = 0;
  itemsPerPage: number = 12;
  totalPages:number = 0;
  pages: number[] = [];
  visiblePages: number[] = [];
  keyword: string = "";
  localStorage?: Storage;
  noebooksearch: boolean= false;
  isPressedAddToLove: boolean = false;
  quantity: number = 1;
  cartItemCount: number = 0; 
  userResponse?: UserResponse | null;

  constructor(
    private ebookService: EbookService,
    private categoryService: CategoryService,  
    private orderService: OrderService,  
    private router: Router,
    private tokenService: TokenService,
    private loveService: LoveService,
    private cartService: CartService,
    private userService: UserService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  ngOnInit() {
    this.currentPage = Number(this.localStorage?.getItem('currentEbookPage')) || 0;
    this.getEbooks(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.getCategories(0, 10);
    // this.updateCartItemCount();
    // this.userResponse = this.userService.getUserResponseFromLocalStorage();
    // if(this.userResponse)
    // {
    //   this.updateCartItemCount();
    // }

  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        debugger;
        this.categories = categories;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  
  searchEbooks() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    debugger;
    this.getEbooks(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  getEbooks(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    debugger;
    this.ebookService.getEbooksUser(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        debugger;
        response.ebooks.forEach((ebook: Ebook) => {          
          ebook.url = `${environment.apiBaseUrl}/ebooks/images/${ebook.thumbnail}`;
          ebook.isLoved = this.loveService.isProductInLove(ebook.id); // Cập nhật isLoved
          
        });
        this.ebooks = response.ebooks;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        this.noebooksearch = this.ebooks.length===0;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching ebooks:', error);
      }
    });    
  }
  

  onPageChange(page: number) {
    debugger;
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentEbookPage', String(this.currentPage)); 
    this.getEbooks(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
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
  
  onEbookClick(ebookId: number) {
    debugger;
    // Điều hướng đến trang detail-ebook với ebookid là tham số
    this.router.navigate(['/ebooks', ebookId]);
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

  // toggleLove(ebook: any, event: Event) {
  //   event.stopPropagation(); // Ngăn việc click vào ebook-item
  //   ebook.isLoved = !ebook.isLoved;
  // }
 
  addToLove(ebook: Ebook, event: Event): void {
    event.stopPropagation();
    this.isPressedAddToLove = true;

    if (!this.tokenService.getUserId()) {
      alert('Bạn cần đăng nhập để thêm yêu thích.');
      this.router.navigate(['/login']);
      return;
    }

    if (ebook) {
      const maxCartSize = 15;

      if (this.loveService.getLove().size >= maxCartSize) {
        alert('Yêu thích của bạn đã đầy. Vui lòng xóa sản phẩm để thêm');
      } else if (this.loveService.isProductInLove(ebook.id)) {
        alert('Sản phẩm đã tồn tại trong yêu thích của bạn.');
      } else {
        this.loveService.addToLove(ebook.id, this.quantity);
        alert('Thêm vào yêu thích thành công.');
        ebook.isLoved = true;
        location.reload();
      }
    } else {
      console.error('Không thể thêm sản phẩm vào yêu thích vì ebook là null.');
    }
  }

  toggleLove(ebook: any, event: Event) {
    event.stopPropagation();
  
    if (!this.tokenService.getUserId()) {
      alert('Bạn cần đăng nhập để thêm yêu thích.');
      this.router.navigate(['/login']);
      return;
    }
  
    if (ebook.isLoved) {
      if (confirm('Xác nhận xóa yêu thích?')) {
      this.loveService.removeFromLove(ebook.id);
      ebook.isLoved = false;
      location.reload();
      }
    } else {
      
      this.addToLove(ebook, event);
      ebook.isLoved = true;
      location.reload();
    }
  }
  // private updateCartItemCount(): void {
  //   this.cartItemCount = this.cartService.getTotalItemCount();

  // }

}
