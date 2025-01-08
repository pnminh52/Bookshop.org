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
        this.products = data;
        this.sortProducts(); // Sort products initially
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  sortProducts(): void {
    this.products.sort((a, b) => {
      if (this.sortOrder === 'asc') {
        return a.price_after_discount - b.price_after_discount;
      } else {
        return b.price_after_discount - a.price_after_discount;
      }
    });
  }

  onSortOrderChange(event: Event): void {
    const target = event.target as HTMLSelectElement;  // Typecast event target
    const order = target.value as 'asc' | 'desc';      // Ensure it's 'asc' or 'desc'
    this.sortOrder = order;
    this.sortProducts();
  }
  onCategoryChange(event: any): void {
    const category = event.target.value;
    this.selectedCategory = category;

    if (category) {
      // Lọc sản phẩm theo thể loại đã chọn
      this.filteredProducts = this.products.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    } else {
      // Nếu không chọn thể loại, hiển thị tất cả sản phẩm
      this.filteredProducts = this.products;
    }
  }
}
