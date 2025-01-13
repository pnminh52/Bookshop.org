import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../product.service';
import { Product } from '../../type/Products';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../cart.service';
import { WishlistService } from '../../wishlist.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  products: Product[] = [];
  product: Product | undefined;
  userId: string | null = null;
  limitedProducts: Product[] = [];
  novelCategory: Product[] = [];
  romanceCategory: Product[] = [];
  fantasyCategory: Product[] = [];
  historyCategory: Product[]=[];
  educationCategory: Product[]=[]
  successMessage: string | null = null;
  alertMessage: string | null = null;
  currentIndex: number = 0;

  constructor(private productService: ProductService,    private cartService: CartService,
    private wishlistService: WishlistService,) {}

  ngOnInit(): void {
    this.loadProducts();
    this.userId = localStorage.getItem('userId');
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
  addToWishlist(): void {
    if (this.product && this.userId) {
      this.wishlistService.getWishlist(this.userId).subscribe({
        next: (wishlist) => {
          const isProductInWishlist = wishlist.some(item => item.id === this.product?.id);
          if (isProductInWishlist) {
            this.alertMessage = 'This product are already in your wishlist!';  // Set success message
            setTimeout(() => {
              this.alertMessage = null; 
            }, 3000);
          } else {
            this.wishlistService.addToWishlist(this.userId!, this.product!).subscribe({
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
    } else {
      console.error('User  ID or Product is missing');
    }
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
