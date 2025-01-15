import { Component } from '@angular/core';
import { ProductService } from '../../product.service';
import { Product } from '../../type/Products';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent {
  products: Product[] = [];
  sortOrder: 'asc' | 'desc' = 'asc'; 
  selectedCategory: string = '';
  filteredProducts: Product[] = [];
  categories: string[] = ['Fiction', 'History', 'Manga', 'Romance', 'Horror', 'Fantasy', 'Education']; 
  isLoading = true;
  currentPage = 1;
  itemsPerPage = 48;
  totalPages = 0;

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo(0,0)
    }
  }

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.renderProduct();
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  renderProduct(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data; 
        this.filteredProducts = this.products; 
        this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage); // Calculate total pages
        this.applyFiltersAndSort(); 
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  applyFiltersAndSort(): void {
    let filtered = this.selectedCategory
      ? this.products.filter(product => 
          product.category.toLowerCase() === this.selectedCategory.toLowerCase())
      : this.products;

    // Sort by price
    filtered.sort((a, b) => {
      if (this.sortOrder === 'asc') {
        return a.price_after_discount - b.price_after_discount;
      } else {
        return b.price_after_discount - a.price_after_discount;
      }
    });

    // Update filtered products
    this.filteredProducts = filtered;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage); // Update total pages after filtering
    this.currentPage = 1; // Reset to the first page after filter or sort change
  }

  onSortOrderChange(event: Event): void {
    const target = event.target as HTMLSelectElement;  // Typecast event target
    const order = target.value as 'asc' | 'desc';      // Ensure it's 'asc' or 'desc'
    this.sortOrder = order;
    this.applyFiltersAndSort();  // Apply filter and sort again
  }

  onCategoryChange(event: any): void {
    const category = event.target.value;
    this.selectedCategory = category;
    this.applyFiltersAndSort();  // Apply filter and sort again
  }
}
