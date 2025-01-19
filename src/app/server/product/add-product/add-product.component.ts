import { Component, inject } from '@angular/core';
import { ProductService } from '../../../product.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule, RouterLink],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
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
    type: new FormControl('', [Validators.required]),
    rating: new FormControl(0, [Validators.required]),
    discount: new FormControl(0, [Validators.required]),
    stock: new FormControl(0, [Validators.required]),
    category_id: new FormControl('', [Validators.required]),
    publish_date: new FormControl('', [Validators.required])
  });
  ngOnInit(): void {
    this.addForm.get('price')?.valueChanges.subscribe(() => {
      this.updateDiscount();
    });

    this.addForm.get('price_after_discount')?.valueChanges.subscribe(() => {
      this.updateDiscount();
    });
  }
  updateDiscount(): void {
    const price = this.addForm.get('price')?.value;
    const priceAfterDiscount = this.addForm.get('price_after_discount')?.value;

    if (price && priceAfterDiscount) {
      const discount = ((price - priceAfterDiscount) / price) * 100;
      this.addForm.patchValue({
        discount: discount.toFixed(2)
      });
    }
  }
  handleSubmit() {
    if (this.addForm.valid) {
      this.productService.addProduct(this.addForm.value).subscribe({
        next: () => {
          alert('Product added successfully');
          this.router.navigate(['/admin/list-product']);
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
