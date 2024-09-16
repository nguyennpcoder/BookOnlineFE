import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { InsertCategoryDTO } from '../../../../dtos/category/insert.category.dto';
import { Category } from '../../../../models/category';
import { CategoryService } from '../../../../services/category.service';
import { EbookService } from '../../../../services/ebook.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-insert.category.admin',
  templateUrl: './insert.category.admin.component.html',
  styleUrls: ['./insert.category.admin.component.scss'],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,    
  ]
})
export class InsertCategoryAdminComponent implements OnInit {
  insertCategoryDTO: InsertCategoryDTO = {
    name: '',    
  };
  categories: Category[] = []; // Dữ liệu động từ categoryService

  constructor(    
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,    
    private ebookService: EbookService,    
  ) {
    
  } 
  ngOnInit() {
    
  }   

  insertCategory() {    
    this.categoryService.insertCategory(this.insertCategoryDTO).subscribe({
      next: (response) => {
        debugger
        alert('Thêm danh mục mới thành công');
        this.router.navigate(['/admin/categories']);        
      },
      error: (error) => {
        debugger
        // Handle error while inserting the category
        // alert(error.error)
        // console.error('Error inserting category:', error);
        this.handleError(error);
      }
    });    
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
        case 409:
        alert('Danh mục đã tồn tại. Vui lòng chọn một tên khác.');
        break; 
      case 404:
        alert('Không tìm thấy tài nguyên.');
        break;
     
    }
  }
}
