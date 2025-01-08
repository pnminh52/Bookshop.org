import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  handleSubmit() {
    const formData = { ...this.registerForm.value, role: 'user' };
  
    this.authService.register(formData).subscribe({
      next: () => {
        if (window.confirm('Đăng ký thành công!')) {
          this.router.navigate(['/login']);
        }
      },
      error: (err: any) => {
        // Hiển thị cảnh báo nếu email đã tồn tại
        if (err.message === 'Email đã được sử dụng!') {
          alert('Email này đã được đăng ký. Vui lòng chọn email khác.');
        } else {
          console.log(err);
        }
      }
    });
  }
  
}
