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
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  userId: string | null = null;
  comments: Comment[] = [];
  newRelatedProducts: Product[]=[];
  newComment: string = '';
  newCreateAt: Date = new Date();
  newRating: number = 0;
  newFullName: string = '';
  newAvatar: string = '';
  successMessage: string | null = null;
  alertMessage: string | null = null;
  likedComments: Set<string> = new Set();
  dislikedComments: Set<string> = new Set();
  recentlyViewedProducts: any[] = [];
  isLoggedIn: boolean = false;
  descriptionVisible: boolean = false;
  aboutAuthorVisible: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private commentService: CommentService,
    private authService: AuthService
  ) {}
  hoverValue: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];

  setRating(value: number) {
    this.newRating = value;
  }

  hoverRating(value: number) {
    this.hoverValue = value;
  }
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
    const viewed = localStorage.getItem('recentlyViewedProducts');
    this.recentlyViewedProducts = viewed ? JSON.parse(viewed) : [];
    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      if (productId) {
        this.loadProductDetails(productId);
      } else {
        console.error('Product ID is not available');
      }
    });
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
  viewProduct(product: Product): void {
    if (!this.isLoggedIn) return;
  
    const viewed = localStorage.getItem('recentlyViewedProducts');
    let products: Product[] = viewed ? JSON.parse(viewed) : [];
  
    // Check if the product is already in the list
    const productExists = products.some((p: Product) => p.id === product.id);
  
    if (!productExists) {
      // Add the new product to the top of the list (index 0)
      products.unshift(product);
      
      // Limit the list to the last 10 products
      if (products.length > 10) {
        products.pop(); 
      }
    } else {
      products = products.filter(p => p.id !== product.id);
      products.unshift(product);
    }
  
    localStorage.setItem('recentlyViewedProducts', JSON.stringify(products));
    this.recentlyViewedProducts = products;
  }
  
  loadProductDetails(productId: string): void {
    this.productService.getProductById(productId).subscribe({
      next: (data) => {
        this.product = data;  
        if (this.product) {
          this.viewProduct(this.product);
        }
        this.loadComments(productId);
        if (this.product?.category) {
          this.loadNewRelatedProducts(this.product.category);
        }
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
      },
    });
  } 

  
  loadNewRelatedProducts(category: string): void {
    this.productService.getProductsByCategory(category).subscribe({
      next: (products) => {
        this.newRelatedProducts = products
          .filter(product => product.id !== this.product?.id)
          .sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())
          .slice(0, 6);
      },
      error: (err) => {
        console.error('Error fetching related products:', err);
      },
    });
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
    if (!this.checkLogin()) {
      return; 
    }

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
    if (!this.checkLogin()) {
      return;
    }
  
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

  toggleDropdown(section: string): void {
    if (section === 'description') {
      this.descriptionVisible = !this.descriptionVisible;
    } else if (section === 'aboutAuthor') {
      this.aboutAuthorVisible = !this.aboutAuthorVisible;
    }
  }
}
