import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../product.service';
import { Product } from '../../type/Products';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  products: Product[] = [];
  limitedProducts: Product[] = [];
  novelCategory: Product[] = [];
  romanceCategory: Product[] = [];
  fantasyCategory: Product[] = [];
  historyCategory: Product[]=[];
  educationCategory: Product[]=[]

  currentIndex: number = 0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.limitedProducts = this.products.slice(0,6);
        // this.filterNovelCategory();
        this.filterRomanceCategory();
        this.filterFantasyCategory();
        this.filterHistoryCategory();
        this.filterEducationCategory();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }
  // filterNovelCategory(): void {
  //   this.novelCategory = this.products.filter(product => product.category === 'Fiction');
  // }
  filterRomanceCategory(): void {
    this.romanceCategory = this.products.filter(product => product.category === 'Romance').slice(0,6);
  }
  filterFantasyCategory(): void {
    this.fantasyCategory = this.products.filter(product => product.category === 'Fantasy').slice(0,6);
  }
  filterHistoryCategory(): void {
    this.historyCategory = this.products.filter(product => product.category === 'History').slice(0,6);
  }
  filterEducationCategory(): void {
    this.educationCategory = this.products.filter(product => product.category === 'Education').slice(0,6);}

  }
