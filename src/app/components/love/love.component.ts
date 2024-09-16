import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { LoveService } from '../../services/love.service';
import { EbookService } from '../../services/ebook.service';
import { Ebook } from '../../models/ebook';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'; 
@Component({
  selector: 'app-love',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './love.component.html',
  styleUrls: ['./love.component.scss']
})
export class LoveComponent implements OnInit {
  lovedItems: Ebook[] = [];
  private router = inject(Router);
  
  constructor(
    private loveService: LoveService,
    private ebookService: EbookService,
    private tokenService: TokenService,
  
  ) {}

  ngOnInit(): void {
    this.loveService.refreshLove(); // Refresh the loved items from localStorage
    this.loadLovedItems(); // Load the loved items
  }

  private loadLovedItems(): void {
    const lovedEbookIds = Array.from(this.loveService.getLove().keys()); // Get loved ebook IDs
    if (lovedEbookIds.length > 0) {
      this.ebookService.getEbooksByIds(lovedEbookIds).subscribe({
        next: (ebooks) => {
          this.lovedItems = ebooks.map((ebook) => ({
            ...ebook,
            isLoved: true, // Mark all items as loved
              thumbnail: `${environment.apiBaseUrl}/ebooks/images/${ebook.thumbnail}`
          }));
          
        },
        error: (error: any) => {
          console.error('Error fetching loved ebooks:', error);
        }
      });
    }
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

  toggleLove(ebook: Ebook, event: Event): void {
    event.stopPropagation();
    if (this.loveService.isProductInLove(ebook.id)) {
      if (confirm('Xác nhận xóa yêu thích?')) {
        this.loveService.removeFromLove(ebook.id);
        ebook.isLoved = false;
        location.reload();
        }
    } else {
      this.loveService.addToLove(ebook.id);
      this.lovedItems.unshift(ebook);
    }
    // ebook.isLoved = !ebook.isLoved; // Toggle the loved state
  }
  onEbookClick(ebookId: number) {
    debugger;
    // Điều hướng đến trang detail-ebook với ebookid là tham số
    this.router.navigate(['/ebooks', ebookId]);
  }
}
