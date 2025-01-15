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
  styleUrl: './new.component.css',
})
export class NewComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [
    'Fiction',
    'History',
    'Manga',
    'Romance',
    'Horror',
    'Fantasy',
    'Education',
  ];
  selectedCategory: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  isLoading = true;
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
        this.applySortByDate();
        this.applyFiltersAndSort();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }
  applyFiltersAndSort(): void {
    let filtered = this.selectedCategory
      ? this.products.filter(
          (product) =>
            product.category.toLowerCase() ===
            this.selectedCategory.toLowerCase()
        )
      : this.products;
    filtered.sort((a, b) => {
      if (this.sortOrder === 'asc') {
        return a.price_after_discount - b.price_after_discount;
      } else {
        return b.price_after_discount - a.price_after_discount;
      }
    });
    this.filteredProducts = filtered.slice(0, 48);
  }
  applySortByDate(): void {
    this.products.sort((a, b) => {
      const dateA = new Date(a.publish_date);
      const dateB = new Date(b.publish_date);
      return dateB.getTime() - dateA.getTime();
    });
  }
  onSortOrderChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const order = target.value as 'asc' | 'desc';
    this.sortOrder = order;
    this.applyFiltersAndSort();
  }
  onCategoryChange(event: any): void {
    const category = event.target.value;
    this.selectedCategory = category;
    this.applyFiltersAndSort();
  }
}
