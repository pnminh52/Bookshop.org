import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../app/type/Products';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:3000/wishlist';

  constructor(private http: HttpClient) {}

  getWishlist(userId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?userId=${userId}`);
  }

  addToWishlist(userId: string, product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}?userId=${userId}`, product);
  }
  removeFromWishlist(userId: string, productId: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/wishlist/${productId}`);
  }
  
  
}
