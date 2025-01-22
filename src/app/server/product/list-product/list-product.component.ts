import { Component, inject } from '@angular/core';
import { ProductService } from '../../../product.service';
import { Product } from '../../../type/Products';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, FormsModule],
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent {
  productService = inject(ProductService);
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  searchQuery: string = '';

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products.reverse();
        this.filteredProducts = this.products; // Initialize filtered products
        this.updateTotalPages();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
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

  onSearch() {
    if (this.searchQuery.trim()) {
      this.filteredProducts = this.products.filter(product =>
        product.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.author.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredProducts = this.products;
    }
    this.updateTotalPages();  // Update total pages based on filtered products
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to the first page after search
  }
}
