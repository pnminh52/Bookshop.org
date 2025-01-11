import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../app/type/Products';

@Injectable({
    providedIn: 'root'
  })
  export class WishlistService {
    private apiUrl = 'http://localhost:3000/wishlist'; // Thay đổi endpoint

    getWishlist(userId: string): Observable<{ products: Product[] }> {
      return this.http.get<{ products: Product[] }>(`${this.apiUrl}?userId=${userId}`);
    } // Base URL
  
    constructor(private http: HttpClient) {}
  

  
    addToWishlist(userId: string, product: Product): Observable<any> {
      return this.http.post(`${this.apiUrl}/${userId}/wishlist`, { product });
    }
  }
  