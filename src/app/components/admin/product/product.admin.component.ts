import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Ebook } from '../../../models/ebook';
import { EbookService } from '../../../services/ebook.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import e from 'express';

@Component({
  selector: 'app-product-admin',
  templateUrl: './product.admin.component.html',
  styleUrls: [
    './product.admin.component.scss',        
  ],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,
  ]
})
export class ProductAdminComponent implements OnInit {
    ebooks: Ebook[] = [];    
    selectedCategoryId: number  = 0; // Giá trị category được chọn
    currentPage: number = 0;
    itemsPerPage: number = 12;
    pages: number[] = [];
    totalPages:number = 0;
    visiblePages: number[] = [];
    keyword:string = "";
    localStorage?:Storage;

    constructor(
      private ebookService: EbookService,      
      private router: Router,     
      private location: Location,
      // @Inject(DOCUMENT) private document: Document
    ) {
      this.localStorage = document.defaultView?.localStorage;
    }
    ngOnInit() {
      this.currentPage = Number(this.localStorage?.getItem('currentEbookAdminPage')) || 0; 
      this.getEbooks(this.keyword, 
        this.selectedCategoryId, 
        this.currentPage, this.itemsPerPage);      
    }    
    searchEbooks() {
      this.currentPage = 0;
      this.itemsPerPage = 12;
      //Mediocre Iron Wallet
      debugger
      this.getEbooks(this.keyword.trim(), this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    }
    getEbooks(keyword: string, selectedCategoryId: number, page: number, limit: number) {
      debugger
      this.ebookService.getEbooks(keyword, selectedCategoryId, page, limit).subscribe({
        next: (response: any) => {
          debugger
          response.ebooks.forEach((ebook: Ebook) => {                      
            if (ebook) {
              ebook.url = `${environment.apiBaseUrl}/ebooks/images/${ebook.thumbnail}`;
              // ebook.audioUrl = ebook.audioUrl ? `${environment.apiBaseUrl}/ebooks/audios/${ebook.audioUrl}` : '';

            }          
          });
          this.ebooks = response.ebooks;
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching products:', error);
        }
      });    
    }

    onPageChange(page: number) {
      debugger;
      this.currentPage = page < 0 ? 0 : page;
      this.localStorage?.setItem('currentProductAdminPage', String(this.currentPage));     
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

    
    // Hàm xử lý sự kiện khi thêm mới sản phẩm
    insertEbook() {
      debugger
      // Điều hướng đến trang detail-product với productId là tham số
      this.router.navigate(['/admin/products/insert']);
    } 

    // Hàm xử lý sự kiện khi sản phẩm được bấm vào
    updateEbook(ebookId: number) {
      debugger
      // Điều hướng đến trang detail-product với productId là tham số
      this.router.navigate(['/admin/products/update', ebookId]);
    }  
    deleteEbook(ebook: Ebook) {      
      const confirmation = window
      .confirm('Bạn có chắc chắn muốn xóa ebook này không?');
      if (confirmation) {
        debugger
        this.ebookService.deleteEbook(ebook.id).subscribe({
          next: (response: any) => {
            debugger 
            alert('Xóa thành công')
            location.reload();          
          },
          
          complete: () => {
            debugger;   
            location.reload();         
          },
          
          error: (error: any) => {
            debugger;
            // alert(error.error)
            console.error('Error fetching ebooks:', error);
            alert(error.error); 
            this.handleError(error);
          }
        });  
        location.reload();
      }      
    } 
    updateActiveStatus(ebook: Ebook) {
      this.ebookService.updateActiveStatus(ebook.id).subscribe({
        next: (response) => {
          // Toggle between true and false
          ebook.active = !ebook.active; 
          alert('Đã thay đổi trạng thái thành công.');
        },
        error: (error) => {
          alert('không thể thay đổi trạng thái.');
          console.error('Cập nhật trạng thái thất bại:', error);
        }
      });
    }
    
    
    
    onProductClick(productId: number) {
      debugger;
      // Điều hướng đến trang detail-product với productId là tham số
      this.router.navigate(['/ebooks', productId]);
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
  

    private handleError(error: any): void {
      console.error('Error:', error);
      switch (error.status) {
        case 401:
          alert('Bạn không có quyền truy cập vào tài nguyên này hoặc cần đăng nhập quản trị viên để thực hiện hành động này.');
          // this.router.navigate(['/']);
          break;
        case 403:
          alert('Bạn không có quyền cập nhật đơn hàng này. Chỉ có quản trị viên mới có quyền thực hiện hành động này.');
          break;
        case 404:
          alert('Không tìm thấy tài nguyên.');
          break;
       
      }
    }
}