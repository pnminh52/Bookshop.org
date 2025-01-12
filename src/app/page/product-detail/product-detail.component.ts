import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../product.service';
import { Product } from '../../type/Products';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart.service';
import { WishlistService } from '../../wishlist.service';
import { CommentService } from '../../comment.service';
import { Comment } from '../../type/Comment';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  userId: string | null = null;
  comments: Comment[] = [];
  newComment: string = '';
  newRating: number = 0;
  newFullName: string = '';
  successMessage: string | null = null;
  alertMessage: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private commentService: CommentService
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
          this.loadComments(productId);
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
      this.successMessage = 'Product added to cart successfully!';  // Set success message
                setTimeout(() => {
                  this.successMessage = null; 
                }, 3000);
    }
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
  loadComments(productId: string): void {
    console.log('Fetching comments for product:', productId);
    this.commentService.getComments(productId).subscribe({
      next: (data) => {
        console.log('Fetched comments:', data);
        this.comments = data; // Cập nhật danh sách comment
      },
      error: (err) => {
        console.error('Error fetching comments:', err);
      }
    });
  }
  
  
  addComment(): void {
    if (this.product && this.userId && this.newComment && this.newFullName && this.newRating > 0) {
      const comment: Comment = {
        productId: this.product.id,
        userId: this.userId,
        fullName: this.newFullName,
        comment: this.newComment,
        rating: this.newRating
      };
  
      this.commentService.addComment(comment).subscribe({
        next: (response) => {
          this.comments.push(response);
          this.newComment = '';
          this.newRating = 0;
        }
      });     
    }
  }
  


  
  
}