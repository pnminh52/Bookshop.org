import { Component, NgModule } from '@angular/core';
import { ProductService } from '../../product.service';
import { Product } from '../../type/Products';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent {
  products: Product[] = [];
  sortOrder: string[] = ['asc', 'desc']; 
  selectedCategory: string = '';
  selectedPriceRange: string = '';
  filteredProducts: Product[] = [];
  categories: string[] = ['Fiction', 'History', 'Manga', 'Romance', 'Horror', 'Fantasy', 'Education']; 
  priceRanges: { label: string, min: number, max: number }[] = [
    { label: '10$ - 30$', min: 10, max: 30 },
    { label: '30$ - 60$', min: 30, max: 60 },
    { label: '60$ - 90$', min: 60, max: 90 }
  ];
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
  onPriceRangeChange(event: any): void {
    this.selectedPriceRange = event.target.value;  
    this.applyFiltersAndSort(); 
  }
  
  renderProduct(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data; 
        this.filteredProducts = this.products; 
        this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage); 
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

      if (this.selectedPriceRange) {
        const priceRange = this.priceRanges.find(range => range.label === this.selectedPriceRange);
        if (priceRange) {
          filtered = filtered.filter(product => 
            product.price_after_discount >= priceRange.min && product.price_after_discount <= priceRange.max
          );
        }
      }
      
      filtered.sort((a, b) => {
        const order = this.sortOrder[0];  
        if (order === 'asc') {
          return a.price_after_discount - b.price_after_discount;
        } else {
          return b.price_after_discount - a.price_after_discount;
        }
      });


    this.filteredProducts = filtered;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage); 
    this.currentPage = 1; 
  }

  onSortOrderChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const order = target.value as 'asc' | 'desc' | ''; 
    this.sortOrder = order ? [order] : [];
    this.applyFiltersAndSort();
  }
  
  onCategoryChange(event: any): void {
    const category = event.target.value;
    if (category === '') {
      this.selectedCategory = ''; 
    } else {
      this.selectedCategory = category;
    }
    this.applyFiltersAndSort();
  }
  
  
  getSelectedFilters(): { category: string, priceRange: string, sortOrder: string } {
    return {
      category: this.selectedCategory || '',
      priceRange: this.selectedPriceRange || '',
      sortOrder: this.sortOrder.length > 0 ? 
        (this.sortOrder[0] === 'asc' ? 'Ascending' : 'Descending') 
        : ''  
    };
  }
  
  
  resetFilter(filter: string): void {
    if (filter === 'category') {
      this.selectedCategory = '';
    } else if (filter === 'priceRange') {
      this.selectedPriceRange = '';
    } else if (filter === 'sortOrder') {
      this.sortOrder = [];  
    }
    this.applyFiltersAndSort();  
  }
  
}
