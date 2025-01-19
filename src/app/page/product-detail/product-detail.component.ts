import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { ProductService } from '../../product.service';
import { Product } from '../../type/Products';
import { CommonModule } from '@angular/common';
import { CartService } from '../../cart.service';
import { WishlistService } from '../../wishlist.service';
import { CommentService } from '../../comment.service';
import { Comment } from '../../type/Comment';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  userId: string | null = null;
  comments: Comment[] = [];
  newComment: string = '';
  newCreateAt: Date = new Date();
  newRating: number = 0;
  newFullName: string = '';
  newAvatar: string = '';
  successMessage: string | null = null;
  alertMessage: string | null = null;
  likedComments: Set<string> = new Set();
  dislikedComments: Set<string> = new Set();
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private commentService: CommentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProductDetails();
    this.userId = localStorage.getItem('userId');
    this.authService.getUserInfo().subscribe({
      next: (data) => {
        this.newFullName = data.fullName;
        this.newAvatar = data.avatar;
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      },
    });
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
        },
      });
    }
  }
  addToCart(): void {
    if (this.checkLogin() && this.product) {
      this.cartService.addToCart(this.product);
      this.successMessage = 'Product added to cart successfully!';
      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
    }
  }
  checkLogin(): boolean {
    if (!this.userId) {
      this.alertMessage = 'You need to login to perform this action!';
      setTimeout(() => {
        this.alertMessage = null;
      }, 3000);
      return false;
    }
    return true;
  }
  addToWishlist(): void {
    if (this.checkLogin() && this.product && this.userId) {
      this.wishlistService.getWishlist(this.userId).subscribe({
        next: (wishlist) => {
          const isProductInWishlist = wishlist.some(
            (item) => item.id === this.product?.id
          );
          if (isProductInWishlist) {
            this.alertMessage = 'This product are already in your wishlist!';
            setTimeout(() => {
              this.alertMessage = null;
            }, 3000);
          } else {
            this.wishlistService
              .addToWishlist(this.userId!, this.product!)
              .subscribe({
                next: (response) => {
                  this.successMessage =
                    'Product added to wishlist successfully!';
                  setTimeout(() => {
                    this.successMessage = null;
                  }, 3000);
                },
              });
          }
        },
      });
    } else {
      console.error('User  ID or Product is missing');
    }
  }
  loadComments(productId: string): void {
    console.log('Fetching comments for product:', productId);
    this.commentService.getComments(productId).subscribe({
      next: (data: Comment[]) => {
        console.log('Fetched comments:', data);
        this.comments = data.filter((comment: Comment) => !comment.hidden).map((comment: Comment) => {
          // Ensure like/dislike counts are initialized if not already
          comment.likeCount = comment.likeCount || 0;
          comment.dislikeCount = comment.dislikeCount || 0; 
          return comment;
        });
      },
      error: (err) => {
        console.error('Error fetching comments:', err);
      },
    });
  }
  
  likeComment(comment: Comment): void {
    if (this.dislikedComments.has(comment.productId)) {
      comment.dislikeCount--;
      this.dislikedComments.delete(comment.productId);
    }
  
    if (this.likedComments.has(comment.productId)) {
      comment.likeCount--;
      this.likedComments.delete(comment.productId);
    } else {
      comment.likeCount++;
      this.likedComments.add(comment.productId);
    }
  
    if (comment.id !== undefined) { 
      this.updateComment(comment);
    } else {
      console.error('Comment ID is undefined');
    }
  }
  

  dislikeComment(comment: Comment): void {
    if (this.likedComments.has(comment.productId)) {
      comment.likeCount--;
      this.likedComments.delete(comment.productId);
    }
  
    if (this.dislikedComments.has(comment.productId)) {
      comment.dislikeCount--;
      this.dislikedComments.delete(comment.productId);
    } else {
      comment.dislikeCount++;
      this.dislikedComments.add(comment.productId);
    }
  
    if (comment.id !== undefined) {  
      this.updateComment(comment);
    } else {
      console.error('Comment ID is undefined');
    }
  }
  

  updateComment(comment: Comment): void {
    if (comment.id) {
      const updateData = {
        likeCount: comment.likeCount,
        dislikeCount: comment.dislikeCount
      };
      this.commentService.updateComment(comment.id, updateData).subscribe({
        next: (updatedComment) => {
          console.log('Comment updated:', updatedComment);
        },
        error: (err) => {
          console.error('Error updating comment:', err);
        }
      });
    } else {
      console.error('Comment ID is undefined');
    }
  }
  
  
  addComment(): void {
    if (!this.product) {
      alert('Sản phẩm không tồn tại');
    } else if (!this.userId) {
      this.checkLogin();
    } else if (!this.newComment) {
      alert('Vui lòng nhập nội dung bình luận');
    } else if (this.newRating <= 0) {
      alert('Đánh giá phải lớn hơn 0');
    } else {
      this.newCreateAt = new Date();
      const avatar = this.newAvatar || 'https://i.pinimg.com/736x/18/b5/b5/18b5b599bb873285bd4def283c0d3c09.jpg';
      const comment: Comment = {
        productId: this.product.id,
        userId: this.userId,
        fullName: this.newFullName,
        comment: this.newComment,
        rating: this.newRating,
        createdAt: this.newCreateAt,
        avatar: avatar,
        likeCount: 0,
        dislikeCount: 0
      };
      this.commentService.addComment(comment).subscribe({
        next: (response) => {
          this.comments.push(response);
          this.newComment = '';
          this.newRating = 0;
        },
      });
    }
  }
}
