import { Component, inject } from '@angular/core';
import { ProductService } from '../../product.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {
  productService = inject(ProductService);
  router = inject(Router);
  addForm:FormGroup= new FormGroup({
    title:new FormControl('',[Validators.required]),
    price:new FormControl('',[Validators.required ,Validators.min(0)]),
    category:new FormControl('',[Validators.required]),

  });
  handleSubmit(){
    this.productService.addProduct(this.addForm.value).subscribe({
      next:()=>{
        if(window.confirm('Product added successfully')){
          this.router.navigate(['/list']);
        }

      }

    })
  }

}

