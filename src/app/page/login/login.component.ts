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
  
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.length > 0) {
          alert('Đăng nhập thành công!');
          this.router.navigate(['/list']);
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
