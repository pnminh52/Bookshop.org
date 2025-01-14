import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  styleUrls: ['./register.component.css'],
  imports:[ReactiveFormsModule,CommonModule, RouterLink  ]
})
export class RegisterComponent {
  registerForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    address: new FormGroup({
      streetAddress: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
    }),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    role: new FormControl('user', Validators.required)
  });

  constructor(private authService: AuthService, private router: Router) {}

  handleSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      formData.role="user";
      this.authService.register(formData).subscribe({
        next: () => {
          alert('Registration successful!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('Registration failed: ' + err.message);
        }
      });
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
