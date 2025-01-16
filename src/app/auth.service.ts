import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, EMPTY } from 'rxjs';
import { throwError } from 'rxjs';
import { switchMap, map } from 'rxjs/operators'; 
import { CartService } from './cart.service'; 
import { Router } from '@angular/router';
import { user } from './type/Auth';
import { WishlistService } from './wishlist.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:3000';
  http = inject(HttpClient);

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private cartService: CartService, 
    private router: Router 
  ) {}
  getUserInfoById(userId: string): Observable<user> {
    return this.http.get<user>(`${this.apiUrl}/users/${userId}`);
  }
  

  register(data: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${data.email}`).pipe(
      switchMap((existingUsers) => {
        if (existingUsers.length > 0) {
          return throwError(() => new Error('Email đã được sử dụng!'));
        } else {
          return this.http.post(`${this.apiUrl}/users`, data);
        }
      })
    );
  }
  getUserInfo(): Observable<any> {
    const userId = this.getUserId();
    if (userId) {
      return this.http.get(`${this.apiUrl}/users/${userId}`);
    } else {
      return EMPTY;
    }
  }
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('userId', user.id);
          localStorage.setItem('role', user.role);
          this.isLoggedInSubject.next(true); 
          this.cartService.loadCartOnLogin(); 
        }
        return users;
      })
    );
  }


  private checkLoginStatus(): boolean {
    return !!localStorage.getItem('user');
  }

  logout(): Observable<void> {
    localStorage.removeItem('user'); 
    localStorage.removeItem('userId');
    localStorage.removeItem('role')
    this.isLoggedInSubject.next(false); 
    this.cartService.clearCart(); 
    this.router.navigate(['/']); 
    return EMPTY; 
  }

}