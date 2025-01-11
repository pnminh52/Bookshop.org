import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../product.service';
import { Product } from '../../type/Products';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart.service';
import { WishlistService } from '../../wishlist.service';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  userId: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.loadProductDetails();
    this.userId = localStorage.getItem('userId');
  }

  loadProductDetails(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe({
        next: (data) => {
          this.product = data;
        },
        error: (err) => {
          console.error('Error fetching product details:', err);
        }
      });
    }
  }
  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product); 
    }
  }
  addToWishlist(): void {
    if (this.product && this.userId) {
      this.wishlistService.addToWishlist(this.userId, this.product).subscribe({
        next: (response) => {
          alert('Product added to wishlist:');
        },
        error: (err) => {
          console.error('Error adding to wishlist:', err);
        }
      });
    } else {
      console.error('User  ID or Product is missing');
    }
  }
  
  


  
  
}