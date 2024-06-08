import { Component, inject } from '@angular/core';
import { ProductService } from '../../product.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  productService = inject(ProductService);
  router = inject(Router);
  productId!: string;
  route = inject(ActivatedRoute);
  addForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    category: new FormControl('', [Validators.required]),
  });
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.productId = params['id'];
      this.productService.getDetali(this.productId).subscribe({
        next: (data) => {
          this.addForm.patchValue(data);
        },
      });
    });
  }

  handleSubmit() {
    console.log(this.addForm.value);
    if (!this.productId) return;
    this.productService.edit(this.productId, this.addForm.value).subscribe({
      next: () => {
        if (window.confirm('Product added successfully')) {
          this.router.navigate(['/list']);
        }
      },
    });
  }
}
