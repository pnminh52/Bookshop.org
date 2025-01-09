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
  sliderImages: string[] = [
    'https://images-production.bookshop.org/spree/promo_banner_slides/desktop_images/310/original/Herod_BookshopAds_2048x600.gif?1736265886',
    'https://images-production.bookshop.org/spree/promo_banner_slides/desktop_images/311/original/DARKMOTHERLAND_2048x600.jpg?1736265945'
  ];
  currentIndex: number = 0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.startSlider();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.limitedProducts = this.products.slice(0,6);
        // this.filterNovelCategory();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  // filterNovelCategory(): void {
  //   this.novelCategory = this.products.filter(product => product.category === 'Fiction');
  // }

  startSlider(): void {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.sliderImages.length;
    }, 3000);
  }
}
