import { Component, inject } from '@angular/core';
import { ProductService } from '../../../product.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule, RouterLink],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
  productService = inject(ProductService);
  router = inject(Router);

  addForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    price_after_discount: new FormControl('', [Validators.required, Validators.min(0)]),
    category: new FormControl('', [Validators.required]),
    author: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    image_url: new FormControl('', [Validators.required]),
    rating: new FormControl(0, [Validators.required]),
    discount: new FormControl(0, [Validators.required]),
    stock: new FormControl(0, [Validators.required]),
    category_id: new FormControl('', [Validators.required]),
    publish_date: new FormControl('', [Validators.required])
  });

  handleSubmit() {
    if (this.addForm.valid) {
      this.productService.addProduct(this.addForm.value).subscribe({
        next: () => {
          alert('Product added successfully');
          this.router.navigate(['/admin/list']); 
        },
        error: (err) => {
          console.error('Error adding product:', err);
        }
      });
    } else {
      console.log("Form is invalid");
    }
  }
}
