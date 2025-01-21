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
  fictionCategory: Product[] = [];
  successMessage: string | null = null;
  alertMessage: string | null = null;
  currentIndex: number = 0;
  isLoading = true;
  imagesToShow = 4;
  images = [
    { src: 'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/01/16/31805_PCS_StephanieGarber_01_16_25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D', alt: 'Image 1' },
    { src: 'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/01/14/31616_PCS_A1_BOGO50-Paperbacks_01_14_25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D', alt: 'Image 2' },
    { src: 'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/01/14/31616_PCS_A2_30OffHardcover_01_14_25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D', alt: 'Image 3' },
    {src:'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/01/07/31575_PCS_A1_BookClub_01_07_25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D', alt: 'Image 4'},
    {src:'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/01/07/31575_PCS_A2_Discover_01_07_25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D', alt: 'Image 5'},
    {src:'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2025/01/07/31575_PCS_A3_YA_BookClub_01_07_25.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D', alt: 'Image 6'},
    {src:'https://prodimage.images-bn.com/lf?set=key%5Bresolve.pixelRatio%5D,value%5B1%5D&set=key%5Bresolve.width%5D,value%5B600%5D&set=key%5Bresolve.height%5D,value%5B10000%5D&set=key%5Bresolve.imageFit%5D,value%5Bcontainerwidth%5D&set=key%5Bresolve.allowImageUpscaling%5D,value%5B0%5D&set=key%5Bresolve.format%5D,value%5Bwebp%5D&source=url%5Bhttps://dispatch.barnesandnoble.com/content/dam/ccr/homepage/daily/2024/12/26/31467_PCS_A3_KidsPWP_TinyTRex_12_26_24.jpg%5D&scale=options%5Blimit%5D,size%5B600x10000%5D&sink=format%5Bwebp%5D', alt: 'Image 7'},

  ];

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.userId = localStorage.getItem('userId');
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
  nextSlide() {
    if (this.currentIndex < this.images.length - this.imagesToShow) {
      this.currentIndex++;
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.sortAndFilterCategories();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  sortAndFilterCategories(): void {
    this.sortAndFilterCategory('Romance', this.romanceCategory);
    this.sortAndFilterCategory('Fantasy', this.fantasyCategory);
    this.sortAndFilterCategory('History', this.historyCategory);
    this.sortAndFilterCategory('Education', this.educationCategory);
    this.sortAndFilterCategory('Fiction', this.fictionCategory);
    this.sortAndFilterCategory('Manga', this.mangaCategory);
  }

  sortAndFilterCategory(category: string, targetArray: Product[]): void {
    targetArray.splice(0, targetArray.length, 
      ...this.products
        .filter((product) => product.category === category)
        .sort((a, b) => 
          new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()
        )
        .slice(0, 6)
    );
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
