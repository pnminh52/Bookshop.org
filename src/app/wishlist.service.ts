import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../app/type/Products';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:3000/wishlist';
  private wishlistSubject = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {}

  getWishlist(userId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      tap((products) => this.wishlistSubject.next(products))
    );
  }

  getWishlistItemsObservable(): Observable<Product[]> {
    return this.wishlistSubject.asObservable();
  }

  addToWishlist(userId: string, product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}?userId=${userId}`, product).pipe(
      tap(() => this.updateWishlist(userId))
    );
  }

  removeFromWishlist(userId: string, productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`).pipe(
      tap(() => this.updateWishlist(userId))
    );
  }

  private updateWishlist(userId: string): void {
    this.getWishlist(userId).subscribe();
  }
}
