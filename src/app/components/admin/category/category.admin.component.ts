import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-category-admin',
  templateUrl: './category.admin.component.html',
  styleUrls: [
    './category.admin.component.scss',        
  ],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,
  ]
})
export class CategoryAdminComponent implements OnInit {
  categories: Category[] = []; // Dữ liệu động từ categoryService
  constructor(    
    private categoryService: CategoryService,    
    private router: Router,    
    ) {}
    
    ngOnInit() {      
      this.getCategories(0, 10);
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
    insertCategory() {
      debugger
      // Điều hướng đến trang detail-category với categoryId là tham số
      this.router.navigate(['/admin/categories/insert']);
    } 

    // Hàm xử lý sự kiện khi sản phẩm được bấm vào
    updateCategory(categoryId: number) {
      debugger      
      this.router.navigate(['/admin/categories/update', categoryId]);
    }  
    deleteCategory(category: Category) {      
      const confirmation = window
      .confirm('Are you sure you want to delete this category?');
      if (confirmation) {
        debugger
        this.categoryService.deleteCategory(category.id).subscribe({
          next: (response: string) => {
            debugger 
            alert('Xóa thành công')
            location.reload();          
          },
          complete: () => {
            debugger;          
          },
          error: (error: any) => {
            debugger;
            // alert(error.error)
            // console.error('Error fetching categories:', error);
            this.handleError(error);
          }
        });  
      } 
      error: (error: any) => {
        debugger;
        // alert(error.error)
        // console.error('Error fetching categories:', error);
        this.handleError(error);
      }
      
      location.reload();               
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