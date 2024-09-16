import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RegisterDTO } from '../../dtos/user/register.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent
  ]
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  // Khai báo các biến tương ứng với các trường dữ liệu trong form
  phoneNumber: string;
  password: string;
  retypePassword: string;
  fullName: string;
  address: string;
  isAccepted: boolean;
  dateOfBirth: Date;
  showPassword: boolean = false;

  constructor(private router: Router, private userService: UserService) { // hàm khởi tạo, điều hướng và làm việc với các tác vụ liên quan
    debugger
    //Khởi tạo các biến
    this.phoneNumber = '';
    this.password = '';
    this.retypePassword = '';
    this.fullName = '';
    this.address = '';
    this.isAccepted = true;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
  }
  //Ghi lại giá trị của phoneNumber mỗi khi người dùng nhập liệu
  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`)

  }



  register() {

    if (!this.registerForm.valid) {
      alert('Bạn cần nhập lại thông tin.');
      return;
    }
    
    //Chuỗi message được tạo ra để chứa thông tin nhập từ form đăng ký giúp kiểm tra và gỡ lỗi
    const message = `phone: ${this.phoneNumber}` +
      `password: ${this.password}` +
      `retypePassword: ${this.retypePassword}` +
      `address: ${this.address}` +
      `fullName: ${this.fullName}` +
      `isAccepted: ${this.isAccepted}` +
      `dateOfBirth: ${this.dateOfBirth}`;
    debugger
    //
    const registerDTO: RegisterDTO = { //  chứa các thông tin cần thiết để đăng ký tài khoản mới, được lấy từ các biến đã khai báo và nhập liệu từ form.
      "fullname": this.fullName,
      "phone_number": this.phoneNumber,
      "address": this.address,
      "password": this.password,
      "retype_password": this.retypePassword,
      "date_of_birth": this.dateOfBirth,
      "facebook_account_id": 0,
      "google_account_id": 0,
      "role_id": 1
    }

    //gọi đến phương thức đăng ký của UserService và gửi registerDTO đến backend.
    this.userService.register(registerDTO).subscribe({    //subscribe để theo dõi kết quả của cuộc gọi HTTP
      next: (response: any) => {   //next: Hàm này được gọi khi nhận được phản hồi thành công từ server
        debugger
        const confirmation = window.confirm('Đăng ký thành công, mời bạn đăng nhập. Bấm "OK" để chuyển đến trang đăng nhập.'); //Hiển thị hộp thoại window 
        if (confirmation) {
          this.router.navigate(['/login']); // chuyển hướng đến logi 
        }
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        debugger
        alert(error?.error?.message ?? '')
      }
    })
  }
  // hiện ẩn mật khẩu
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  // kiểm tra password và retypePassword có giống nhau không
  checkPasswordsMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword']
        .setErrors({ 'passwordMismatch': true });
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }

  // kiểm tra ngày sinh
  checkAge() {
    if (this.dateOfBirth) {
      const today = new Date(); // ngày hiện tại
      const birthDate = new Date(this.dateOfBirth); // ngày sinh
      let age = today.getFullYear() - birthDate.getFullYear(); // năm hienj tại - năm sinh
      const monthDiff = today.getMonth() - birthDate.getMonth(); //  // tháng hiện tại trừ tháng sinh

      // kiểm tra tháng sinh có trùng ngày hiện tại không, ngày sinh có nhỏ hơn ngày hiện tại ko nếu có thì tuổi -1
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({ 'invalidAge': true }); // nhỏ hơn 18 thì hiện lỗi
        return;
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null); // >18 thì lỗi là null
      }
    }

  }
}

