import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InsertEbookDTO } from '../../../../dtos/ebook/insert.ebook.dto';
import { Category } from '../../../../models/category';
import { CategoryService } from '../../../../services/category.service';
import { EbookService } from '../../../../services/ebook.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KindOfBook } from '../../../../models/kind-of-book.enum';

@Component({
  selector: 'app-insert.product.admin',
  templateUrl: './insert.product.admin.component.html',
  styleUrls: ['./insert.product.admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class InsertProductAdminComponent implements OnInit {
  insertEbookDTO: InsertEbookDTO = new InsertEbookDTO({
    name: '',
    price: 0,
    title: '',
    document: '',
    thumbnail: '',
    kindofbook: 'FREE', 
    evaluate: 4,
    audio_url: '',
    category_id: [],
    mp3s:[], 
    images: [] 
  });
  categories: Category[] = [];
  kindOfBookKeys = Object.keys(KindOfBook) as Array<keyof typeof KindOfBook>;
  kindOfBookValues = KindOfBook;
  audioFile?: File;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private ebookService: EbookService,
  ) {}

  ngOnInit() {
    this.getCategories(1, 100);
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 5) {
      alert('Tối đa chỉ có 5 hình ảnh.');
      return;
    }
    this.insertEbookDTO.images = Array.from(files);
    if (this.insertEbookDTO.images.length > 0) {
      this.insertEbookDTO.thumbnail = this.insertEbookDTO.images[0].name;
    }
  }

  onMp3FileChange(event: any) {
    const files = event.target.files;
    if (files.length > 5) {
      alert('Tối đa chỉ có 5 file mp3s.');
      return;
    }
    else
    {
    this.insertEbookDTO.mp3s = Array.from(files);
    }
    // if (this.insertEbookDTO.mp3s.length > 0) {
    //   this.insertEbookDTO.audio_url = this.insertEbookDTO.mp3s[0].name;
    // }
  }
  // onAudioFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.audioFile = file;
  //     this.insertEbookDTO.audio_url = file.name;
  //   }
  // }

  onCategoryChange(categoryId: number): void {
    const index = this.insertEbookDTO.category_id.indexOf(categoryId);
    if (index === -1) {
      // Category is not in the list, add it
      this.insertEbookDTO.category_id.push(categoryId);
    } else {
      // Category is already in the list, remove it
      this.insertEbookDTO.category_id.splice(index, 1);
    }
  }

  insertProduct() {
    // console.log('Inserting product with DTO:', this.insertEbookDTO);
    if (this.insertEbookDTO.kindofbook === KindOfBook.FREE || this.insertEbookDTO.kindofbook === KindOfBook.MEMBERSHIP) {
      this.insertEbookDTO.price = 0;
      return;
    } 
    else if (this.insertEbookDTO.kindofbook === KindOfBook.FOR_SALE && this.insertEbookDTO.price <= 0) {
      alert('Ebook bán giá tiền phải lớn hơn 0');
      return; // Exit the function to prevent form submission
    }

    this.ebookService.insertEbook(this.insertEbookDTO).subscribe({
      next: (response) => {
        console.log('Insert response:', response);
        const ebookId = response.id;

        if (this.insertEbookDTO.images.length > 0) {
          this.uploadImages(ebookId);
        }
        
        
        // if (this.audioFile) {
        //   this.uploadAudio(ebookId);
        // }
        if (this.insertEbookDTO.mp3s.length > 0) {
          this.uploadMp3s(ebookId);
        }
        alert('Thêm sản phẩm thành công');

        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (error) => {
        this.handleError(error);
        console.error('Error inserting ebook:', error);
        const errorMessage = error.error?.message || error.message || 'Unknown error';
        alert(`Error inserting ebook: ${errorMessage}`);
      }
    }); 
  }

  // uploadImages(ebookId: number) {
  //   this.ebookService.uploadImages(ebookId, this.insertEbookDTO.images).subscribe({
  //     next: (imageResponse) => {
  //       console.log('Images uploaded successfully:', imageResponse);
  //     },
  //     error: (error) => {
  //       console.error('Error uploading images:', error);
  //       alert(`Error uploading images: ${error.error?.message || error.message}`);
  //     }
  //   });
  // }


  uploadImages(ebookId: number) {
    const formData = new FormData();
    this.insertEbookDTO.images.forEach((file, index) => {
      formData.append(`images`, file, file.name);
    });

    this.ebookService.uploadImages(ebookId, this.insertEbookDTO.images).subscribe({
      next: (imageResponse) => {
        console.log('Images uploaded successfully:', imageResponse);
      },
      error: (error) => {
        console.error('Error uploading images:', error);
        alert(`Error uploading images: ${error.error?.message || error.message}`);
      }
    });
  }

  uploadMp3s(ebookId: number) {
    const formData = new FormData();
    this.insertEbookDTO.mp3s.forEach((file) => {
      formData.append('audio', file, file.name);
    });

    this.ebookService.uploadmp3s(ebookId, this.insertEbookDTO.mp3s).subscribe({
      next: (audioResponse) => {
        console.log('Audio uploaded successfully:', audioResponse);
      },
      error: (error) => {
        console.error('Error uploading audio:', error);
        alert(`Error uploading audio: ${error.error?.message || error.message}`);
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
  // uploadMp3s(ebookId: number) {
  //   if (this.audioFile) {
  //     this.ebookService.uploadmp3s(ebookId, this.insertEbookDTO.mp3s).subscribe({
  //       next: (audioResponse) => {
  //         console.log('Audio uploaded successfully:', audioResponse);
  //       },


  //       error: (error) => {
  //         console.error('Error uploading audio:', error);
  //         alert(`Error uploading audio: ${error.error?.message || error.message}`);
  //       }
  //     });
  //   }
  // }

}
