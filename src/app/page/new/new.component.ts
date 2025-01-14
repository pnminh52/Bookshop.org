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

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.renderProduct();
  }

  renderProduct(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data; // Save all products
        this.filteredProducts = this.products; // Show all products initially
        this.applySortByDate(); // Apply sorting by release date when products are fetched
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  applySortByDate(): void {
    // Sort products by publish_date (newest first)
    this.filteredProducts.sort((a, b) => {
      const dateA = new Date(a.publish_date);
      const dateB = new Date(b.publish_date);
      return dateB.getTime() - dateA.getTime(); // Sort descending (most recent first)
    });
  }
}
