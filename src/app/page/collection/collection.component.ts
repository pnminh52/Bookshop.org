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
  selectedRelease: string = '';
  selectedStock: string = ''; 
  filteredProducts: Product[] = [];
  categories: string[] = ['Fiction', 'History', 'Manga', 'Romance', 'Horror', 'Fantasy', 'Education']; 
  priceRanges: { label: string, min: number, max: number }[] = [
    { label: '5$ - 15$', min: 5, max:15  },
    { label: '15$ - 25$', min: 15, max:20  },
    { label: '25$ - 35$', min: 25, max: 35 },
    { label: '35$ - 40$', min: 35, max: 40 },
    { label: '40$+', min: 40, max: 999 },
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
  
    if (!this.sortOrder.length) {
      this.sortOrder = [];  
    }
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

      if (this.selectedRelease) {
        filtered.sort((a, b) => {
          const dateA = new Date(a.publish_date).getTime();
          const dateB = new Date(b.publish_date).getTime();
          return this.selectedRelease === 'oldest' ? dateA - dateB : dateB - dateA;
        });
      }
      if (this.sortOrder[0] === 'asc' || this.sortOrder[0] === 'desc') {
      }
    this.filteredProducts = filtered;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage); 
    this.currentPage = 1; 
  }



onSortOrderChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const order = target.value as 'asc' | 'desc' | ''; 
  this.sortOrder = order ? [order] : [];  // Đảm bảo không có giá trị mặc định
  this.applyFiltersAndSort();
}

  onReleaseChange(event: any): void {
    this.selectedRelease = event.target.value;
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
  
  
  getSelectedFilters(): { category: string, priceRange: string, sortOrder: string, release: string } {
    return {
      category: this.selectedCategory || '',
      priceRange: this.selectedPriceRange || '',
      sortOrder: this.sortOrder.length > 0 ? 
        (this.sortOrder[0] === 'asc' ? 'Price increase' : 'Price decrease') 
        : '',  
      release: this.selectedRelease ? 
        (this.selectedRelease === 'oldest' ? 'Oldest release' : 'Newest release') 
        : '',
  
    };
  }
  
  
  
  

  
  
  resetFilter(filter: string): void {
    if (filter === 'category') {
      this.selectedCategory = '';
    } else if (filter === 'priceRange') {
      this.selectedPriceRange = '';
    } else if (filter === 'sortOrder') {
      this.sortOrder = [];  
    } else if (filter === 'release') {
      this.selectedRelease = '';
    } 
    this.applyFiltersAndSort();  
  }
  countBooks():number{
    return this.filteredProducts.length
  }
  
}
