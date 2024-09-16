import { Component, OnInit } from '@angular/core';
import { Category } from '../../../../models/category';
import { CategoryService } from '../../../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateCategoryDTO } from '../../../../dtos/category/update.category.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail.category.admin',
  templateUrl: './update.category.admin.component.html',
  styleUrls: ['./update.category.admin.component.scss'],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,
  ]
})

export class UpdateCategoryAdminComponent implements OnInit {
  categoryId: number;
  updatedCategory: Category;
  
  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
  
  ) {
    this.categoryId = 0;    
    this.updatedCategory = {} as Category;  
  }

  ngOnInit(): void {    
    this.route.paramMap.subscribe(params => {
      debugger
      this.categoryId = Number(params.get('id'));
      this.getCategoryDetails();
    });
    
  }
  
  getCategoryDetails(): void {
    this.categoryService.getDetailCategory(this.categoryId).subscribe({
      next: (category: Category) => {        
        this.updatedCategory = { ...category };                        
      },
      complete: () => {
        
      },
      error: (error: any) => {
        
      }
    });     
  }
  updateCategory() {
    // Implement your update logic here
    const updateCategoryDTO: UpdateCategoryDTO = {
      name: this.updatedCategory.name,      
    };
    this.categoryService.updateCategory(this.updatedCategory.id, updateCategoryDTO).subscribe({
      next: (response: any) => {  
        debugger        
      },
      complete: () => {
        debugger;
        alert('Cập nhật danh mục thành công')
        location.reload();
        // this.router.navigate(['/admin/categories']);        
      },
      error: (error) => {
        debugger
        // Handle error while inserting the category
        // alert(error.error)
        // console.error('Error inserting category:', error);
        alert('Cập nhật danh mục không thành công. Danh mục đã tồn tại')
        this.handleError(error);
        return
      }
    });  
  }  
  
  private handleError(error: any): void {
    console.error('Error:', error);
    switch (error.status) {
      case 401:
        // alert('Bạn không có quyền truy cập vào tài nguyên này hoặc cần đăng nhập quản trị viên để thực hiện hành động này.');
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
