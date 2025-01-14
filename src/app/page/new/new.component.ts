import { Component } from '@angular/core';
import { ProductService } from '../../product.service';
import { Product } from '../../type/Products';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['Fiction', 'History', 'Manga', 'Romance', 'Horror', 'Fantasy','Education']; 
  selectedCategory: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.renderProduct();
  }

  renderProduct(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data; // Save all products
        this.applySortByDate(); // First, sort by date to get the newest books
        this.applyFiltersAndSort(); // Then apply filters and sort by price
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  applyFiltersAndSort(): void {
    // Lọc theo thể loại
    let filtered = this.selectedCategory
      ? this.products.filter(product => 
          product.category.toLowerCase() === this.selectedCategory.toLowerCase())
      : this.products;

    // Sắp xếp theo giá
    filtered.sort((a, b) => {
      if (this.sortOrder === 'asc') {
        return a.price_after_discount - b.price_after_discount;
      } else {
        return b.price_after_discount - a.price_after_discount;
      }
    });

    // Giới hạn chỉ lấy 30 sách mới nhất
    this.filteredProducts = filtered.slice(0, 48); // Show only the top 30 products
  }

  applySortByDate(): void {
    // Sort products by publish_date (newest first)
    this.products.sort((a, b) => {
      const dateA = new Date(a.publish_date);
      const dateB = new Date(b.publish_date);
      return dateB.getTime() - dateA.getTime(); // Sort descending (most recent first)
    });
  }

  onSortOrderChange(event: Event): void {
    const target = event.target as HTMLSelectElement;  // Typecast event target
    const order = target.value as 'asc' | 'desc';      // Ensure it's 'asc' or 'desc'
    this.sortOrder = order;
    this.applyFiltersAndSort();  // Apply filters and sorting by price
  }

  onCategoryChange(event: any): void {
    const category = event.target.value;
    this.selectedCategory = category;
    this.applyFiltersAndSort();  // Apply category filter and sorting by price
  }
}
