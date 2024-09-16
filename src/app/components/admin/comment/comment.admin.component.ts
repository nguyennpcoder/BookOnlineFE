import { Component, Inject, OnInit } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { Comment } from '../../../models/comment';
import { CommonModule, DOCUMENT } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment.admin.component.html',
  styleUrls: ['./comment.admin.component.scss']
})
export class CommentComponent implements OnInit {
  comments: Comment[] = [];
  isLoading: boolean = false;
  users: User[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  keyword: string = "";
  localStorage?: Storage;
  
  constructor(
    private commentService: CommentService,
    private userService: UserService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  ngOnInit(): void {
    this.currentPage = Number(this.localStorage?.getItem('currentUserAdminPage')) || 0;
    this.checkAccessAndLoadComments();
    
    // this.loadComments();

    // this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
  }

  private checkAccessAndLoadComments(): void {
    this.userService.getUsers(this.keyword, this.currentPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.users = response.users;
        this.totalPages = response.totalPages;
        
        // Nếu kiểm tra quyền thành công, tiếp tục tải bình luận
        this.loadComments();
      },
      error: (error: any) => {
        this.handleError(error, 'getUsers');
      }
    });
  }

  private handleError(error: any, context: string): void {
    console.error(`Error in ${context}:`, error);
    switch (error.status) {
      case 401:
        alert('Bạn cần đăng nhập để truy cập vào tài nguyên này.');
        // Có thể chuyển hướng đến trang đăng nhập ở đây
        break;
      case 404:
        alert('Không tìm thấy tài nguyên.');
        break;
      case 500:
        alert('Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.');
        break;
      default:
        alert('Đã xảy ra lỗi. Vui lòng thử lại.');
        break;
    }
  }
  loadComments(): void {
    this.isLoading = true;
    this.commentService.getAllComments().subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading comments', err);
        this.isLoading = false;
      }
    });
  }

  // deleteComment(commentId: number): void {
  //   if (confirm('Are you sure you want to delete this comment?')) {
  //     this.commentService.deleteComment(commentId).subscribe({
  //       next: (response: any) => {
  //         this.comments = this.comments.filter(comment => comment.id !== commentId);
  //         debugger
  //         location.reload(); 
  //         alert('Xóa comment thành công')
  //       },
  //       error: (err) => {
  //         console.error('Error deleting comment', err);
  //       }
  //     });
  //   }
  // }

  deleteComment(commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {

      this.commentService.deleteComment(commentId).subscribe({
        next: (response: any) => {
          this.comments = this.comments.filter(comment => comment.id !== commentId);
          alert('Xóa comment thành công');
          // Reload page to reflect changes
          location.reload();
        },
        error: (err) => {
          console.error('Error deleting comment', err);
          // Handle specific error cases
          if (err.status === 401) {
            alert('Bạn không có quyền xóa comment này');
          } else if (err.status === 404) {
            alert('Comment không tồn tại');
          } else if (err.status === 500) {
            alert('Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.');
          } else {
            alert('Đã xảy ra lỗi. Vui lòng thử lại.');
          }
        }
      });
    }
  }

  // getUsers(keyword: string, page: number, limit: number): void {
  //   this.userService.getUsers(keyword, page, limit).subscribe({
  //     next: (response: any) => {
  //       this.users = response.users;
  //       this.totalPages = response.totalPages;
  //     },
  //     error: (error: any) => {
  //       if (error.status === 401) {
  //         // Xử lý khi yêu cầu không được xác thực
  //         alert('Bạn cần đăng nhập để truy cập vào tài nguyên này.');
          
  //         // Chuyển hướng đến trang đăng nhập hoặc hiển thị thông báo khác
  //       } else {
  //         console.error('Error fetching users:', error);
  //         // Xử lý các lỗi khác nếu cần thiết
  //       }
  //     }
  //   });
  // }
}
