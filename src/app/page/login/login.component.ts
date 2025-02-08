import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService);
  successMessage: string | null = null;
  alertMessage: string | null = null;
  router = inject(Router);
isAdmin=false
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
          const user = response[0];
          this.successMessage = 'Login successfully, redirecting...';
          localStorage.setItem('user', JSON.stringify(user));
          if (user.role === 'admin') {
            localStorage.setItem('role', 'admin');
            this.isAdmin = true;
              this.router.navigate(['/admin/']);
          } else {
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1000); 
          }
        } else {
          this.alertMessage = 'Incorrect username or password!';        }
      },
      error: (err: any) => {
        console.log(err);
        this.alertMessage = 'An error occurred, please try again!';      }
    });
  }
  
}