import { Component } from '@angular/core';
import { ProductService } from '../../product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
const routes: Routes = [
  { path: 'product/:id', component: ProductDetailComponent },
];
@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  imports: [CommonModule, FormsModule,RouterModule],
  styleUrls: ['./search.component.css'], 
})
export class SearchComponent {
  searchTerm: string = '';
  products: any[] = [];

  constructor(private productService: ProductService) {}
  countBooks():number{
    return this.products.length
  }
  search() {
    if (this.searchTerm) {
      this.productService.getAll().subscribe((data: any) => {
        this.products = data.filter((product: any) => 
          product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.author.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
    } else {
      this.products = [];
    }
  }

}