import { Injectable } from '@angular/core';
import { Product } from './type/Products';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private wishList: Product[] = [];
  private wishListSubject = new BehaviorSubject<Product[]>(this.wishList);
  private currentUserKey: string = '';

  constructor() {
    this.loadWishListFromLocalStorage();
  }

  // Thiết lập User hiện tại
  setCurrentUser(userId: string): void {
    this.currentUserKey = `wishList_${userId}`;
    this.loadWishListFromLocalStorage();
  }

  // Thêm sản phẩm vào wishlist
  addProductToWishList(product: Product): void {
    const isProductExist = this.wishList.some((p) => p.id === product.id);
    if (isProductExist) {
      alert('Product is already in your Wishlist.');
      return;
    }

    this.wishList.push(product);
    this.saveWishListToLocalStorage();
    this.wishListSubject.next(this.wishList);
    alert('Product added to Wishlist!');
  }

  // Xóa sản phẩm khỏi wishlist
  removeProductFromWishList(product: Product): void {
    const index = this.wishList.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      this.wishList.splice(index, 1);
      this.saveWishListToLocalStorage();
      this.wishListSubject.next(this.wishList);
    }
  }

  // Lấy danh sách wishlist
  getWishList() {
    return this.wishListSubject.asObservable();
  }

  // Lưu wishlist vào localStorage
  private saveWishListToLocalStorage(): void {
    if (this.currentUserKey) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(this.wishList));
    }
  }

  // Tải wishlist từ localStorage
  private loadWishListFromLocalStorage(): void {
    const storedWishList = localStorage.getItem(this.currentUserKey);
    if (storedWishList) {
      this.wishList = JSON.parse(storedWishList);
      this.wishListSubject.next(this.wishList);
    }
  }

  // Xóa wishlist khi logout
  clearWishList(): void {
    this.wishList = [];
    this.wishListSubject.next(this.wishList);
    if (this.currentUserKey) {
      localStorage.removeItem(this.currentUserKey);
    }
  }

  // Lấy số lượng sản phẩm trong wishlist
  getWishListCount(): number {
    return this.wishList.length;
  }
}
