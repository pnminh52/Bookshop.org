// import { Component, inject } from '@angular/core';
// import { AuthService } from '../../auth.service';
// import { Router } from '@angular/router';
// import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { NgIf } from '@angular/common';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [ReactiveFormsModule,NgIf],
//   templateUrl: './register.component.html',
//   styleUrl: './register.component.css'
// })
// export class RegisterComponent {
//   authService = inject(AuthService);
//   router = inject(Router);

//   registerForm: FormGroup = new FormGroup({
//     email: new FormControl('', [Validators.required, Validators.email]),
//     password: new FormControl('', [Validators.required])
//   });

//   handleSubmit() {

//     this.authService.register(this.registerForm.value).subscribe({
//       next: () => {
//         if (window.confirm('Đăng ký thành công!')) {
//           this.router.navigate(['/login']);
//         }
//       },
//       error: (err: any) => {
//         console.log(err);
//       }
//     });
//   }
// }
