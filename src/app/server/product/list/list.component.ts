import { Component, inject } from '@angular/core';
import { ProductService } from '../../../product.service';
import { Product } from '../../../type/Products';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  productService = inject(ProductService);
  products: Product[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products.reverse();
        this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.products.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  handleDelete(id: string) {
    if (window.confirm('Are you sure you want to delete this')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.loadProducts(); // Reload products after deletion
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
}
