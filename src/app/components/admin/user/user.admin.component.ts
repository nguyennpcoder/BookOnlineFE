import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpUtilService } from '../../../services/http.util.service';
import { Token } from '@angular/compiler';
import { TokenService } from '../../../services/token.service';
import { UserResponse } from '../../../responses/user/user.response';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user.admin.component.html',
  styleUrls: ['./user.admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class UserAdminComponent implements OnInit {
  users: User[] = [];
  userResponse?: UserResponse;
  selectedUser: User | null = null;
  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  keyword: string = "";
  localStorage?: Storage;
  tokensv: string = "";
  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  ngOnInit(): void {
    this.currentPage = Number(this.localStorage?.getItem('currentUserAdminPage')) || 0;
    this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
  }

  searchUsers(): void {
    this.currentPage = 0;
    this.itemsPerPage = 10;
    this.getUsers(this.keyword.trim(), this.currentPage, this.itemsPerPage);
  }

  // getUsers(keyword: string, page: number, limit: number): void {
  //   this.userService.getUsers(keyword, page, limit).subscribe({
  //     next: (response: any) => {
  //       this.users = response.users;
  //       this.totalPages = response.totalPages;
  //     },
  //     error: (error: any) => {
  //       console.error('Error fetching users:', error);
  //     }
  //   });
  // }
  getUsers(keyword: string, page: number, limit: number): void {
    this.userService.getUsers(keyword, page, limit).subscribe({
      next: (response: any) => {
        this.users = response.users;
        this.totalPages = response.totalPages;
      },
      error: (error: any) => {
        if (error.status === 401) {
          // Xử lý khi yêu cầu không được xác thực
          alert('Bạn cần đăng nhập để truy cập vào tài nguyên này.');
          // Chuyển hướng đến trang đăng nhập hoặc hiển thị thông báo khác
        } else {
          console.error('Error fetching users:', error);
          // Xử lý các lỗi khác nếu cần thiết
        }
      }
    });
  }


  onPageChange(page: number): void {
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentUserAdminPage', String(this.currentPage));
    this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
  }

  navigateToAddUser(): void {
    this.router.navigate(['/admin/users/add']);
  }

  navigateToEditUser(userId: number): void {
    this.router.navigate(['/admin/users/update', userId]);
  }

  private userRole: string = '';

  checkRole(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.tokensv = this.tokenService.getToken();
      this.userService.getUserDetail(this.tokensv).subscribe({
        next: (response: any) => {
          this.userRole = response?.role?.name || '';  // Lưu vai trò người dùng vào biến thành viên
          resolve();
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
          reject(error);
        }
      });
    });
  }

  toggleUserStatus(user: User): void {
    
    if (user.role.name === 'admin') {
      alert("Đây là tài khoản admin. Bạn không thể thay đổi trạng thái của tài khoản này.");
      return;
    }

    // Nếu không phải admin, tiến hành khóa hoặc mở khóa tài khoản
    const confirmation = window.confirm(`Bạn có chắc chắn muốn ${user.is_active ? 'khóa' : 'mở khóa'} người dùng ${user.fullname}?`);
    if (confirmation) {
      const active = !user.is_active; // Đảo ngược trạng thái hiện tại
      this.userService.blockOrEnableUser(user.id, active).subscribe({
        next: () => {
          alert(`User ${user.fullname} đã được ${active ? 'mở khóa' : 'khóa'} thành công`);

          if (!active) {
            this.tokenService.removeToken();
          }

          // Sau khi thành công, cập nhật lại danh sách người dùng
          this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
        },
      }
      )
      location.reload();
    }

  }


  //   if (confirmation) {
  //     const active = !user.is_active; // Đảo ngược trạng thái hiện tại
  //     this.userService.blockOrEnableUser(user.id, active).subscribe(
  //       {
  //         next: () => {
  //           alert(`User ${user.fullname} ${active ? 'enabled' : 'blocked'} successfully`);

  //           if (!active) {
  //             this.tokenService.removeToken();

  //           }
  //           // Sau khi thành công, cập nhật lại danh sách người dùng
  //           this.getUsers(this.keyword, this.currentPage, this.itemsPerPage);
  //           return;
  //         }
  //       });
  //       location.reload();  
  //   }
  // }
}
