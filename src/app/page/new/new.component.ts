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
  sortOrder: 'asc' | 'desc' = 'asc'; // Default sort order
  selectedCategory: string = '';
  filteredProducts: Product[] = [];
  categories: string[] = ['Fiction', 'History', 'Economics', 'Psychology', 'Romance', 'Horror', 'Action', 'Fantasy']; // Danh sách thể loại
  
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.renderProduct();
  }

  renderProduct(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data; // Lưu tất cả sản phẩm
        this.filteredProducts = this.products; // Hiển thị tất cả sản phẩm ban đầu
        this.applyFiltersAndSort(); // Apply filters and sorting when products are fetched
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

    // Cập nhật danh sách sản phẩm đã lọc và sắp xếp
    this.filteredProducts = filtered;
  }

  onSortOrderChange(event: Event): void {
    const target = event.target as HTMLSelectElement;  // Typecast event target
    const order = target.value as 'asc' | 'desc';      // Ensure it's 'asc' or 'desc'
    this.sortOrder = order;
    this.applyFiltersAndSort();  // Áp dụng lại lọc và sắp xếp
  }

  onCategoryChange(event: any): void {
    const category = event.target.value;
    this.selectedCategory = category;
    this.applyFiltersAndSort();  // Áp dụng lại lọc và sắp xếp
  }
}
