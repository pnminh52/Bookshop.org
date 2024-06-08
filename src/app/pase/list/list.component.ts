import { Component, inject } from '@angular/core';
import { ProductService } from '../../product.service';
import { Product } from '../../tye/Products';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterLink,NgIf,NgFor],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
productService = inject(ProductService);
products:Product[]=[];
ngOnInit() {
  this.productService.getAll().subscribe({
    next: (products) => {
      this.products = products;
    },
    error: (err) => {
      console.log(err);
    }
  });
}

handleDelete(id: string) {
  if(window.confirm('Are you sure you want to delete this')){
    this.productService.delete(id).subscribe({
      next: () => {
        this.productService.getAll().subscribe({
          next: (products) => {
            this.products = products;
          },
          error: (err) => {
            console.log(err);
          }
        });
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
}
