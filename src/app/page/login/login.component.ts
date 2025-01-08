import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  handleSubmit() {
    if (this.loginForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        if (response.length > 0) {
          const user = response[0]; // Lấy thông tin người dùng đầu tiên
          alert('Đăng nhập thành công!');

          // Kiểm tra role và điều hướng
          if (user.role === 'admin') {
            this.router.navigate(['/list']); // Điều hướng đến trang list cho admin
          } else {
            this.router.navigate(['/home']); // Điều hướng đến trang home cho user thường
          }
        } else {
          alert('Tài khoản hoặc mật khẩu không đúng!');
        }
      },
      error: (err: any) => {
        console.log(err);
        alert('Đã xảy ra lỗi, vui lòng thử lại!');
      }
    });
  }
}