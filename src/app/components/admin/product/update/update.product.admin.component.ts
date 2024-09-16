import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Ebook } from '../../../../models/ebook';
import { Category } from '../../../../models/category';
import { EbookService } from '../../../../services/ebook.service';
import { CategoryService } from '../../../../services/category.service';
import { environment } from '../../../../../environments/environment';
import { EbookImage } from '../../../../models/ebook.image';
import { UpdateEbookDTO } from '../../../../dtos/ebook/update.ebook.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KindOfBook } from '../../../../models/kind-of-book.enum';
import { EbookMp3 } from '../../../../models/ebook.mp3';

@Component({
  selector: 'app-detail.product.admin',
  templateUrl: './update.product.admin.component.html',
  styleUrls: ['./update.product.admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ]
})

export class UpdateProductAdminComponent implements OnInit {
  ebookId: number;
  ebook: Ebook;
  updatedEbook: Ebook;
  categories: Category[] = []; // Dữ liệu động từ categoryService
  currentImageIndex: number = 0;
  images: File[] = [];
  newimage: File[] = [];
  mp3s: File[] = [];
  newimp3: File[] = [];
  selectedCategoryIds: number[] = [];
  audioFile?: File;
  kindOfBookKeys = Object.keys(KindOfBook) as Array<keyof typeof KindOfBook>;
  kindOfBookValues = KindOfBook;



  constructor(
    private ebookService: EbookService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private location: Location,
  ) {
    this.ebookId = 0;
    this.ebook = {} as Ebook;
    this.updatedEbook = {} as Ebook;
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      this.ebookId = Number(params.get('id'));

      this.getEbookDetails();

    });
    this.getCategoriesByEbookId(); // Fetch categories when component initializes
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

  getEbookDetails(): void {
    this.ebookService.getDetailEbook(this.ebookId).subscribe({
      next: (ebook: Ebook) => {
        this.ebook = ebook;
        this.updatedEbook = { ...ebook };
  
        this.selectedCategoryIds = ebook.category_ids || []; 

        this.updatedEbook.ebook_images.forEach((image: EbookImage) => {
          if (!image.image_url.startsWith(environment.apiBaseUrl)) {
            image.image_url = `${environment.apiBaseUrl}/ebooks/images/${image.image_url}`;
          }
        });
        this.updatedEbook.ebook_mp3s.forEach((mp3: EbookMp3) => {
          if (!mp3.mp3_url.startsWith(environment.apiBaseUrl)) {
            mp3.mp3_url = `${environment.apiBaseUrl}/ebooks/audios/${mp3.mp3_url}`;
          }
        });
      },
      error: (error: any) => {
        console.error('Error fetching ebook details:', error);
      }
    });
  }
  // getCategoriesByEbookId(): void {
  //   this.ebookService.getCategoriesByEbookId(this.ebookId).subscribe({
  //     next: (categories: Category[]) => {
  //       console.log('Categories received:', categories); // Debugging line
  //       this.categories = categories;
  //     },
  //     error: (error: any) => {
  //       console.error('Error fetching categories:', error);
  //     }
  //   });
  // }
  getCategoriesByEbookId(): void {
    this.ebookService.getCategoriesByEbookId(this.ebookId).subscribe({
      next: (response: any[]) => {
        // Extract the categories from the response
        this.categories = response.map(item => item.category);
        console.log('Categories received:', this.categories); // Debugging line
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategoryIds.includes(categoryId);
  }
  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown'; // Return 'Unknown' if category not found
  }
  onCategoryChange(event: any, categoryId: number): void {
    if (event.target.checked) {
      this.selectedCategoryIds.push(categoryId);
    } else {
      const index = this.selectedCategoryIds.indexOf(categoryId);
      if (index !== -1) {
        this.selectedCategoryIds.splice(index, 1);
      }
    }
  }
  showImage(index: number): void {
    debugger
    if (this.ebook && this.ebook.ebook_images &&
      this.ebook.ebook_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ        
      if (index < 0) {
        index = 0;
      } else if (index >= this.ebook.ebook_images.length) {
        index = this.ebook.ebook_images.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    debugger
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }

  nextImage(): void {
    debugger
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    debugger
    this.showImage(this.currentImageIndex - 1);
  }


  updateProduct() {
    if (this.updatedEbook.kindofbook === KindOfBook.FREE || this.updatedEbook.kindofbook === KindOfBook.MEMBERSHIP) {
      this.updatedEbook.price = 0;
    }

    if (this.updatedEbook.kindofbook === KindOfBook.FOR_SALE && this.updatedEbook.price <= 0) {
      alert('Ebook bán giá tiền phải lớn hơn 0');
      return;
    }

    const updateEbookDTO: UpdateEbookDTO = {
      name: this.updatedEbook.name,
      price: this.updatedEbook.price,
      title: this.updatedEbook.title,
      kindofbook: this.updatedEbook.kindofbook,
      evaluate: this.updatedEbook.evaluate,
      audioUrl: this.updatedEbook.audioUrl,
      thumbnail: this.updatedEbook.thumbnail,
      document: this.updatedEbook.document,
      category_ids: this.selectedCategoryIds // Send selected category IDs
    };

    this.ebookService.updateEbook(this.ebookId, updateEbookDTO).subscribe({
      next: () => {
        this.router.navigate(['/admin/ebooks']);
        alert("Cập nhật thành công");
      },
      error: (error: any) => {
        console.error('Error updating ebook:', error);
        if (error.status === 400 && error.error.message.includes('Ebook bán giá tiền phải lớn hơn 0')) {
          alert(error.error.message);
        } else {
          this.handleError(error);
        }
      }
    });
  }
  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 5) {
      alert('Please select a maximum of 5 images.');
      return;
    }
    this.newimage = Array.from(files);
    if (this.newimage.length > 0) {
      this.updatedEbook.thumbnail = this.newimage[0].name;
    }
    this.images = files;
    this.ebookService.uploadImages(this.ebookId, this.images).subscribe({
      next: (imageResponse) => {
        this.images = [];
        this.getEbookDetails();

        location.reload();
      },
      error: (error) => {
        alert(error.error);
        console.error('Error uploading images:', error);
        this.handleError(error);
      }
    });
  }

  onMp3FileChange(event: any) {
    const files = event.target.files;
    if (files.length > 5) {
      alert('Please select a maximum of 5 images.');
      return;
    }
    this.newimp3 = Array.from(files);
    this.mp3s = files;
    this.ebookService.uploadmp3s(this.ebookId, this.mp3s).subscribe({
      next: (mp3Response) => {
        this.images = [];
        this.getEbookDetails();
        location.reload();
      },
      error: (error) => {
        alert(error.error);
        console.error('Error uploading images:', error);
        this.handleError(error);
        location.reload();
      }

    });

  }

  // onAudioFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.audioFile = file;

  //     // Call uploadAudio service with optional chaining
  //     this.ebookService.uploadAudio(this.ebookId, file).subscribe({
  //       next: (response: any) => {
  //         // Handle successful upload response (optional)
  //         console.log('Audio uploaded successfully:', response);
  //         this.updatedEbook.audioUrl = response.audioUrl || file?.name; // Use optional chaining
  //         alert('Audio uploaded successfully!');
  //       },
  //       error: (error: any) => {

  //         console.error('Error uploading audio:', error);
  //         // alert('Error uploading audio: ' + error.message);
  //         this.handleError(error);
  //         location.reload();
  //       }
  //     });
  //   }
  //}

  // onFileChange(event: any) {
  //   const files = event.target.files;
  //   if (files.length > 5) {
  //     alert('Please select a maximum of 5 images.');
  //     return;
  //   }
  //   this.newimage = Array.from(files);

  //   // Nếu cần cập nhật thumbnail ở backend, không cần làm gì thêm ở đây.

  //   this.images = files;
  //   this.ebookService.uploadImages(this.ebookId, this.images).subscribe({
  //     next: (imageResponse) => {
  //       debugger;
  //       console.log('Images uploaded successfully:', imageResponse);
  //       this.images = [];
  //       this.getEbookDetails();
  //     },
  //     error: (error) => {
  //       alert(error.error);
  //       console.error('Error uploading images:', error);
  //     }
  //   });
  // }



  deleteImage(ebookImage: EbookImage) {
    if (confirm('Are you sure you want to remove this image?')) {
      // Call the removeImage() method to remove the image   
      this.ebookService.deleteEbookImage(ebookImage.id).subscribe({
        next: (ebookImage: EbookImage) => {
          location.reload();
        },
        error: (error) => {
          // Handle the error while uploading images
          alert(error.error)
          console.error('Error deleting images:', error);
        }
      });
    }
  }
  deleteMp3(ebookMp3: EbookMp3): void {
    if (confirm('Are you sure you want to remove this MP3?')) {
      this.ebookService.deleteEbookMp3(ebookMp3.id).subscribe({
        next: (ebookMp3: EbookMp3) => {
          location.reload();
        },
        error: (error) => {
          // Handle the error while uploading mp3s
          alert(error.error)
          console.error('Error deleting mp3s:', error);
        }
      });
      // Implement MP3 deletion logic if necessary
      alert('MP3 deletion functionality not implemented yet.');
    }
  }

  uploadAudio(ebookId: number) {
    if (this.audioFile) {
      this.ebookService.uploadAudio(ebookId, this.audioFile).subscribe({
        next: (audioResponse) => {
          console.log('Audio uploaded successfully:', audioResponse);
          location.reload();
        },
        error: (error) => {
          console.error('Error uploading audio:', error);
          alert(`Error uploading audio: ${error.error?.message || error.message}`);
          location.reload();
        }
      });
      location.reload();
    }
  }

  trackByMp3Url(index: number, item: EbookMp3): string {
    return item.mp3_url;
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
