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
  
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.renderProduct();
  }

  renderProduct(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data; 
        this.filteredProducts = this.products; 
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
