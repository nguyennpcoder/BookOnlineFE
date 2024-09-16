import { Component, ViewChild, OnInit } from '@angular/core';
import { LoginDTO } from '../../dtos/user/login.dto';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { RoleService } from '../../services/role.service'; // Import RoleService
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginResponse } from '../../responses/user/login.response';
import { Role } from '../../models/role'; // Đường dẫn đến model Role
import { UserResponse } from '../../responses/user/user.response';
import { CartService } from '../../services/cart.service';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule
  ]
})
export class LoginComponent implements OnInit
{
  @ViewChild('loginForm') loginForm!: NgForm; //Tham chiếu đến form đăng nhập.

// /Các thuộc tính để xử lý đầu vào form và trạng thái.
  phoneNumber: string = '123123';
  password: string = '123123';
  showPassword: boolean = false;

  roles: Role[] = []; // Mảng roles
  rememberMe: boolean = true;
  selectedRole: Role | undefined; // Biến để lưu giá trị được chọn từ dropdown  Để xử lý các vai trò được lấy từ API.
  userResponse?: UserResponse  // Để lưu chi tiết người dùng sau khi đăng nhập.

  message: string = ''; // Message to display
  messageTimeout: any;



  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
    //how to validate ? phone must be at least 6 characters
  }
  constructor(
    //điều hướng, thao tác người dùng, quản lý token, lấy vai trò và thao tác giỏ hàng.
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService,
    private cartService: CartService
  ) { }

  ngOnInit() {  
    
    // Lấy danh sách các vai trò từ API và khởi tạo mảng roles và selectedRole.
    debugger
    this.roleService.getRoles().subscribe({      //gọi API để lấy danh sách các vai trò.subscribe lắng nghe kết quả từ API
      next: (roles: Role[]) => { //xử lý kết quả thành công: 
        debugger
        this.roles = roles; //gán danh sách vai trò vào this.roles và 
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;  //chọn vai trò đầu tiên (nếu có) làm this.selectedRole
      },

      complete: () => {  debugger },  //được gọi khi quá trình gọi API hoàn tất mà không có lỗi.
      error: (error: any) => {
        debugger
        console.error('Error getting roles:', error); // xử lý bất kỳ lỗi nào xảy ra trong quá trình gọi API
                                                    // và ghi lại lỗi đó
      }
    });
  }
  
  createAccount() {
    debugger
    // Chuyển hướng người dùng đến trang đăng ký (hoặc trang tạo tài khoản)
    this.router.navigate(['/register']); 
  }


  // login() { 
  //   //thông điệp đăng nhập
  //   const message = `phone: ${this.phoneNumber}` +
  //     `password: ${this.password}`;
  //   debugger

  //   ///////
  //   const loginDTO: LoginDTO = { 
  //     //tạo LoginDTO với số điện thoại, mật khẩu và ID vai trò đã chọn.
  //     phone_number: this.phoneNumber,
  //     password: this.password,
  //     role_id: this.selectedRole?.id ?? 1
  //   };

  //   this.userService.login(loginDTO).subscribe({ //Gọi userService.login để xác thực người dùng và xử lý phản hồi. API login
  //     next: (response: LoginResponse) => {
  //       debugger;
  //       const { token } = response;

  //       //XL  đăng nhập
  //       if (this.rememberMe) {  //Nếu rememberMe được chọn 
  //         this.tokenService.setToken(token);  //lưu token bằng cách sử dụng tokenService.
  //         debugger;
  //         this.userService.getUserDetail(token).subscribe(
  //           {   //Lấy chi tiết người dùng bằng token.
  //           next: (response: any) => { //khi backend phản hồi thành công
  //             debugger //dừng lại và kiểm tra giá trị của response.
  //             this.userResponse = {  //tạo đối tượng userResponse sao chép tất cả từ response  vào 
  //               ...response,  
  //               date_of_birth: new Date(response.date_of_birth),  //chuyển date_of_birth thành kiểu Date
  //             };  

  //             //Lưu thông tin người dùng 
  //             this.userService.saveUserResponseToLocalStorage(this.userResponse); 
  //             // kiểm tra role để chuyển hớng
  //             if(this.userResponse?.role.name == "admin") { 
  //               this.router.navigate(['/admin']);    
  //             } else if(this.userResponse?.role.name == 'user') {
  //               this.router.navigate(['/']);                      
  //             }
              
  //           },
  //           // complete: () => {
  //           //   this.cartService.refreshCart();
  //           //   debugger;
  //           // },
  //           error: (error: any) => { // hiển thị lỗi nếu bị lỗi lấy thông tin người dùng
  //             debugger; 
  //             alert(error.error.message);
  //           }
  //         })
  //       }                        
  //     },
  //     complete: () => { 
  //       debugger;
  //     },
  //     error: (error: any) => { // hiển thị lỗi chi tiết nếu bị lỗi 
  //       debugger; 
  //       alert(error.error.message);
  //     }
  //   });
  // }


  login() {
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    };

    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        const { token } = response;

        if (this.rememberMe) {
          this.tokenService.setToken(token);

          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              this.userResponse = {
                ...response,
                date_of_birth: new Date(response.date_of_birth)
              };

              this.userService.saveUserResponseToLocalStorage(this.userResponse);

              if (this.userResponse?.role.name === 'admin') {
                this.router.navigate(['/admin']);
              } else if (this.userResponse?.role.name === 'user') {
                this.router.navigate(['/']);
              }

              this.message = 'Đăng nhập thành công!';
              this.setCloseTimeout(); // Set timeout to hide message
            },
            error: (error: any) => {
              console.error('Error fetching user details:', error);
              this.message = 'Lỗi khi lấy thông tin chi tiết người dùng';
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Login error:', error);
        this.message = 'Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập của bạn.';
        this.setCloseTimeout(); // Set timeout to hide message
      }
    });
  }

setCloseTimeout() {
  this.clearCloseTimeout(); // Clear existing timeout (if any)
  this.messageTimeout = setTimeout(() => {
      this.message = ''; // Clear message after timeout
  }, 1500); // 3000 milliseconds = 3 seconds
}
clearCloseTimeout() {
  if (this.messageTimeout) {
    clearTimeout(this.messageTimeout);
  }
}


  togglePassword() {
    this.showPassword = !this.showPassword; //hiện ẩn mật khẩu
  }
}
