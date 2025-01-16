import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../product.service';
import { Product } from '../../type/Products';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../wishlist.service';
import { AuthService } from '../../auth.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSkeletonLoaderModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  product: Product | undefined;
  userId: string | null = null;
  products: Product[] = [];
  novelCategory: Product[] = [];
  romanceCategory: Product[] = [];
  fantasyCategory: Product[] = [];
  historyCategory: Product[] = [];
  educationCategory: Product[] = [];
  mangaCategory: Product[] = [];
  fictionCategory: Product[]=[]
  successMessage: string | null = null;
  alertMessage: string | null = null;
  currentIndex: number = 0;
  isLoading = true;

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.userId = localStorage.getItem('userId');
    setTimeout(()=>{
      this.isLoading=false;

    },2000)
    
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.filterRomanceCategory();
        this.filterFantasyCategory();
        this.filterHistoryCategory();
        this.filterEducationCategory();
        this.filterFictionCategory();
        this.filterMangaCategory();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  filterRomanceCategory(): void {
    this.romanceCategory = this.products
      .filter((product) => product.category === 'Romance')
      .slice(0, 6);
  }
  filterFantasyCategory(): void {
    this.fantasyCategory = this.products
      .filter((product) => product.category === 'Fantasy')
      .slice(0, 6);
  }
  filterHistoryCategory(): void {
    this.historyCategory = this.products
      .filter((product) => product.category === 'History')
      .slice(0, 6);
  }
  filterEducationCategory(): void {
    this.educationCategory = this.products
      .filter((product) => product.category === 'Education')
      .slice(0, 6);
  }
  filterFictionCategory(): void {
    this.fictionCategory = this.products
      .filter((product) => product.category === 'Fiction')
      .slice(0, 6);
  }
  filterMangaCategory(): void {
    this.mangaCategory = this.products
      .filter((product) => product.category === 'Manga')
      .slice(0, 6);
  }

  addToWishlist(product: Product): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        this.alertMessage = 'You need to login to add product to wishlist!'; 
        setTimeout(() => {
          this.alertMessage = null; 
        }, 3000);
        return;
      }
      const userId = this.authService.getUserId();
      if (!userId) {
        console.error('User  ID is null');
        return;
      }
      this.product = product;
      this.wishlistService.getWishlist(userId).subscribe({
        next: (wishlist) => {
          const isProductInWishlist = wishlist.some(item => item.id === this.product?.id);
          if (isProductInWishlist) {
            this.alertMessage = 'This product are already in your wishlist!'; 
            setTimeout(() => {
              this.alertMessage = null; 
            }, 3000);
          } else {
            this.wishlistService.addToWishlist(userId, this.product!).subscribe({
              next: (response) => {
                this.successMessage = 'Product added to wishlist successfully!';  // Set success message
                setTimeout(() => {
                  this.successMessage = null; 
                }, 3000);
              }
            });
          }
        }
      });
    });
  }
}
