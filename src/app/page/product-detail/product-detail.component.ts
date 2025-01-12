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
    if (this.product && this.userId && this.newComment && this.newRating > 0) {
      const comment: Comment = {
        productId: this.product.id,
        userId: this.userId,
        comment: this.newComment,
        rating: this.newRating
      };
  
      console.log('Adding comment:', comment); // Debug log
      this.commentService.addComment(comment).subscribe({
        next: (response) => {
          console.log('Comment added:', response); // Debug log
          this.comments.push(response);
          this.newComment = '';
          this.newRating = 0;
        },
        error: (err) => {
          console.error('Error adding comment:', err);
        }
      });
    }
  }
  


  
  
}